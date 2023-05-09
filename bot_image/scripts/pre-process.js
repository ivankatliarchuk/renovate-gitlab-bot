#!/usr/bin/env node

const { log, warn, setScope } = require("../lib/logger");
const { DRY_RUN, RENOVATE_STOP_UPDATING_LABEL } = require("../lib/constants");
const { GitLabAPIIterator, GitLabAPI } = require("../lib/api");
const {
  cleanLabels,
  runProcessingOnConfig,
} = require("../lib/processing-helpers");

setScope(`[Pre-Processing]`);

const ADDED_STOP_UPDATE_COMMENT = "<!-- STOP_RENOVATE_COMMENT -->";

async function findRenovateComment(mr) {
  const NotesIterator = new GitLabAPIIterator(`${mr}/notes`);
  for await (const note of NotesIterator) {
    if (note.body.includes(ADDED_STOP_UPDATE_COMMENT)) {
      return note;
    }
  }
  return null;
}

const COMMENT_MORE_INFO = `
Adding ~"${RENOVATE_STOP_UPDATING_LABEL}" in order to prevent renovate from updating the MR.

If you want the MR to be updated again, please remove the label _and_ check the "rebase checkbox" in the description.
`;

async function writeComment(mr, note) {
  return GitLabAPI.post(`${mr}/notes`, {
    body: [note, COMMENT_MORE_INFO, ADDED_STOP_UPDATE_COMMENT].join("\n\n"),
  });
}

async function preProcessMR(mr) {
  const {
    project_id,
    iid,
    labels: prevLabelsRaw,
    merge_when_pipeline_succeeds: mwpsSet,
  } = mr;
  const apiBase = `/projects/${project_id}/merge_requests/${iid}`;

  const prevLabels = cleanLabels(prevLabelsRaw);

  if (prevLabels.includes(RENOVATE_STOP_UPDATING_LABEL)) {
    log("stopUpdatingLabel already set");
    return;
  }

  let setLabel = false;

  if (mwpsSet) {
    log("MWPS already set, we should ask renovate to stop MRs");
    setLabel = `Merge request already has "MWPS" set.`;
  } else {
    log("Checking approvals");
    const { data: approvals } = await GitLabAPI.get(`${apiBase}/approvals`);
    const { approved_by: approvedBy } = approvals;
    if (approvedBy.length > 0) {
      log(`Already approved by ${approvedBy.map((x) => x?.user?.username)}`);
      setLabel = `Merge request already approved.`;
    }
  }

  const payload = {};

  if (setLabel) {
    const renovateNote = await findRenovateComment(apiBase);

    if (renovateNote) {
      log(
        `Looks like someone removed the ${RENOVATE_STOP_UPDATING_LABEL} label, we are not going to set it again.`
      );
      return;
    }

    payload.labels = [...prevLabels, RENOVATE_STOP_UPDATING_LABEL];
    log(`Updating MR ${iid} with ${JSON.stringify(payload)}`);
    if (DRY_RUN) {
      log("Not executing, DRY-RUN enabled");
    } else {
      await writeComment(apiBase, setLabel);
      await GitLabAPI.put(apiBase, payload);
    }
  } else {
    log("Nothing to do");
  }
}

runProcessingOnConfig(preProcessMR)
  .then(() => {
    log("Done");
  })
  .catch((e) => {
    warn("An error happened");
    warn(e.message);
    warn(e.stack);
    process.exit(1);
  });
