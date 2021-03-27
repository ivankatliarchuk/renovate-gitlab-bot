const { sampleSize } = require("lodash");
const factory = require("gitlab-api-async-iterator");

const { GitLabAPI, GitLabAPIIterator } = factory();

const MATCHER = /```json\s*(?<json>.+?)\s*```/m;
const RENOVATE_BOT_USER = "gitlab-renovate-bot";
const SAMPLE_SIZE = 2;

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
    } = mr;
    console.log(`Checking ${web_url}`);

    const prevLabels = cleanLabels(prevLabelsRaw);

    if (prevAssignees.length && prevLabels.length) {
      console.log("Already has assignees and labels set, nothing to do");
      continue;
    }

    const apiBase = `/projects/${project_id}/merge_requests/${iid}`;
    let metadata;
    try {
      metadata = await findRenovateComment(`${apiBase}/notes`);
    } catch (e) {
      console.log(e.message);
      continue;
    }

    const { assignees = [], labels = [] } = metadata;

    const payload = {};
    let update = false;

    if (!prevAssignees.length && assignees.length) {
      update = true;
      const newAssignees = sampleSize(assignees, SAMPLE_SIZE);
      console.log(`No assignees set, setting ${newAssignees}`);

      payload.assignee_ids = await Promise.all(newAssignees.map(getUserId));
    }

    if (!prevLabels.length && labels.length) {
      update = true;
      console.log(`No labels set, setting ${labels}`);
      payload.labels = labels;
    }

    if (update) {
      console.log(`Updating MR ${iid} with ${JSON.stringify(payload)}`);
      GitLabAPI.put(apiBase, payload);
    } else {
      console.log("Nothing to do");
    }
  }
}

main().then(() => {
  console.log("Done");
});
