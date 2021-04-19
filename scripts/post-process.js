const { sampleSize } = require("lodash");
const factory = require("gitlab-api-async-iterator");

const { GitLabAPI, GitLabAPIIterator } = factory();

const MATCHER = /```json\s*(?<json>.+?)\s*```/m;
const RENOVATE_BOT_USER = "gitlab-renovate-bot";
const SAMPLE_SIZE = 2;

const DRY_RUN = (process.env.DRY_RUN ?? "true") === "true";

function log(msg1, ...msg) {
  console.log(`[Post-Processing] ${msg1}`, ...msg);
}

function warn(msg1, ...msg) {
  console.warn(`[Post-Processing] ${msg1}`, ...msg);
}

const MRIterator = new GitLabAPIIterator("/merge_requests", {
  author_username: RENOVATE_BOT_USER,
  state: "opened",
  scope: "all",
});

async function findRenovateComment(mr) {
  const NotesIterator = new GitLabAPIIterator(mr);
  for await (const note of NotesIterator) {
    if (note.author.username === RENOVATE_BOT_USER && MATCHER.test(note.body)) {
      const match = note.body.match(MATCHER).groups;
      return JSON.parse(match.json);
    }
  }
  throw new Error("No Note Found");
}

function cleanLabels(labels) {
  return labels.filter((l) => l !== "Community contribution");
}

const usermap = {};

async function getUserId(username) {
  if (!usermap[username]) {
    const { data } = await GitLabAPI.get(
      `/users?username=${username.substr(1)}`
    );
    usermap[username] = data.find((u) => u.username === username.substr(1)).id;
  }

  return usermap[username];
}

async function main() {
  for await (const mr of MRIterator) {
    const {
      project_id,
      iid,
      web_url,
      assignees: prevAssignees,
      labels: prevLabelsRaw,
      reviewers: prevReviewers,
    } = mr;
    log(`Checking ${web_url}`);

    const prevLabels = cleanLabels(prevLabelsRaw);

    if (prevReviewers.length && prevLabels.length) {
      log("Already has reviewers and labels set, nothing to do");
      continue;
    }

    const apiBase = `/projects/${project_id}/merge_requests/${iid}`;
    let metadata;
    try {
      metadata = await findRenovateComment(`${apiBase}/notes`);
    } catch (e) {
      log(e.message);
      continue;
    }

    const { assignees = [], labels = [] } = metadata;

    const payload = {};
    let update = false;

    if (!prevAssignees.length) {
      update = true;
      payload.assignee_ids = await Promise.all(
        [RENOVATE_BOT_USER].map(getUserId)
      );
    }

    if (!prevReviewers.length && assignees.length) {
      update = true;
      const newAssignees = sampleSize(assignees, SAMPLE_SIZE);
      log(`No reviewers set, setting ${newAssignees.join(", ")}`);

      payload.reviewer_ids = await Promise.all(newAssignees.map(getUserId));
    }

    if (!prevLabels.length && labels.length) {
      update = true;
      log(`No labels set, setting ${labels.join(", ")}`);
      payload.labels = labels;
    }

    if (update) {
      log(`Updating MR ${iid} with ${JSON.stringify(payload)}`);
      if (DRY_RUN) {
        log("Not executing, due to dry run is set");
      } else {
        GitLabAPI.put(apiBase, payload);
      }
    } else {
      log("Nothing to do");
    }
  }
}

main()
  .then(() => {
    log("Done");
  })
  .catch((e) => {
    warn("An error happened");
    warn(e.message);
    process.exit(1);
  });
