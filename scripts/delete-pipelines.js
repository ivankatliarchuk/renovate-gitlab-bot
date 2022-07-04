#!/usr/bin/env node

const { DateTime } = require("luxon");
const factory = require("gitlab-api-async-iterator");

const { GitLabAPI, GitLabAPIIterator } = factory();
const STOP_SCRIPT_AT = DateTime.now().plus({ minutes: 10 });

const PROJECT_ID = "15445883";

function log(msg1, ...msg) {
  console.log(`[Delete Pipelines] ${msg1}`, ...msg);
}

function warn(msg1, ...msg) {
  console.warn(`[Delete Pipelines] ${msg1}`, ...msg);
}

const FOUR_WEEKS_AGO = DateTime.now().minus({ days: 28 });

const pipelinesIterator = new GitLabAPIIterator(
  `/projects/${PROJECT_ID}/pipelines`,
  {
    per_page: 100,
    updated_before: FOUR_WEEKS_AGO.toISO({
      suppressMilliseconds: true,
      suppressSeconds: false,
      includeOffset: true,
    }),
  }
);

async function deletePipelines(pipelineURLs) {
  await Promise.all(pipelineURLs.map((url) => GitLabAPI.delete(url)));
}

async function main() {
  let c = 0;
  let stack = [];
  for await (const pipeline of pipelinesIterator) {
    c += 1;
    const { id, created_at, web_url } = pipeline;
    log(`Checking ${web_url}`);

    if (FOUR_WEEKS_AGO > DateTime.fromISO(created_at)) {
      log(`Pipeline ${web_url} is older than four weeks, deleting`);
      stack.push(`/projects/${PROJECT_ID}/pipelines/${id}`);
    }

    if (stack.length > 10) {
      await deletePipelines(stack);
      stack = [];
    }

    if (DateTime.now() > STOP_SCRIPT_AT) {
      log("Script ran for more than 10 minutes, stopping");
      break;
    }
  }
  await deletePipelines(stack);
  log(`Processed ${c} pipelines`);
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
