#!/usr/bin/env node

const { sampleSize } = require("lodash");
const { log, warn, setScope } = require("../lib/logger");
const { RENOVATE_BOT_USER, DRY_RUN } = require("../lib/constants");
const {
  GitLabAPIIterator,
  GitLabAPI,
  createRenovateMRIterator,
  getUserId,
} = require("../lib/api");

setScope(`[Post-Processing]`);

const MATCHER = /```json\s*(?<json>.+?)\s*```/m;
const SAMPLE_SIZE = 2;

async function findRenovateComment(mr) {
  const NotesIterator = new GitLabAPIIterator(mr);
  for await (const note of NotesIterator) {
    if (note.author.username === RENOVATE_BOT_USER && MATCHER.test(note.body)) {
      const match = note.body.match(MATCHER).groups;
      return JSON.parse(match.json);
    }
  }
  throw new Error(`No Note from ${RENOVATE_BOT_USER} found`);
}

function cleanLabels(labels) {
  return labels.filter((l) => l !== "Community contribution");
}

async function main() {
  if (DRY_RUN) {
    log("DRY RUN ENABLED");
  }

  const MRIterator = createRenovateMRIterator();

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

    const { labels = [], reviewers = [] } = metadata;

    const payload = {};
    let update = false;

    if (!prevAssignees.length) {
      update = true;
      payload.assignee_ids = await Promise.all(
        [RENOVATE_BOT_USER].map(getUserId)
      );
    }

    if (!prevReviewers.length && reviewers.length) {
      update = true;
      const newReviewers = sampleSize(reviewers, SAMPLE_SIZE);
      log(`No reviewers set, setting ${newReviewers.join(", ")}`);

      payload.reviewer_ids = await Promise.all(newReviewers.map(getUserId));
    }

    if (!prevLabels.length && labels.length) {
      update = true;
      log(`No labels set, setting ${labels.join(", ")}`);
      payload.labels = labels;
    }

    if (update) {
      log(`Updating MR ${iid} with ${JSON.stringify(payload)}`);
      if (DRY_RUN) {
        log("Not executing, DRY-RUN enabled");
      } else {
        await GitLabAPI.put(apiBase, payload);
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
