#!/usr/bin/env node

import sampleSize from "lodash/sampleSize.js";

import { DRY_RUN, RENOVATE_BOT_USER } from "../lib/constants.mjs";
import { log, setScope, warn } from "../lib/logger.mjs";
import { getUserIds, GitLabAPI, GitLabAPIIterator } from "../lib/api.mjs";
import {
  cleanLabels,
  runProcessingOnConfig,
} from "../lib/processing-helpers.mjs";

setScope(`[Post-Processing]`);

const MATCHER = /```json\s*(?<json>.+?)\s*```/m;
const SAMPLE_SIZE_FALLBACK = 2;

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

async function postProcessMR(mr, repositoryConfig) {
  const {
    project_id,
    iid,
    assignees: prevAssignees,
    labels: prevLabelsRaw,
    reviewers: prevReviewers,
  } = mr;

  const prevLabels = cleanLabels(prevLabelsRaw);

  if (prevReviewers.length && prevLabels.length) {
    log("MR has reviewers and labels set, nothing to do");
    return;
  }

  const apiBase = `/projects/${project_id}/merge_requests/${iid}`;
  let metadata;
  try {
    metadata = await findRenovateComment(`${apiBase}/notes`);
  } catch (e) {
    log(e.message);
    return;
  }

  const { labels = [], reviewers = [] } = metadata;

  const payload = {};
  let update = false;

  if (!prevAssignees.length) {
    update = true;
    payload.assignee_ids = await getUserIds(RENOVATE_BOT_USER);
  }

  if (!prevReviewers.length && reviewers.length) {
    update = true;
    const reviewerSampleSize =
      repositoryConfig?.reviewersSampleSize ?? SAMPLE_SIZE_FALLBACK;
    const newReviewers = sampleSize(reviewers, reviewerSampleSize);
    log(
      `No reviewers set, setting ${newReviewers.join(
        ", "
      )} (sample size=${reviewerSampleSize})`
    );

    payload.reviewer_ids = await getUserIds(newReviewers);
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

runProcessingOnConfig(postProcessMR)
  .then(() => {
    log("Done");
  })
  .catch((e) => {
    warn("An error happened");
    warn(e.message);
    warn(e.stack);
    process.exitCode = 1;
  });
