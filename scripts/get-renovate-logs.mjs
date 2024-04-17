#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
import asyncPool from "tiny-async-pool";

import { log, setScope, warn } from "../bot_image/lib/logger.mjs";
import {
  RENOVATE_PROJECT_ID,
  RENOVATE_WEB_URL,
} from "../bot_image/lib/constants.mjs";
import {
  forEachMR,
  getProjectFromSlug,
  GitLabAPI,
  GitLabAPIIterator,
} from "../bot_image/lib/api.mjs";
import { loadAllConfigs } from "./lib/load-all-configs.mjs";
import { configPathToJobName } from "./lib/generate-ci-yaml.mjs";

setScope(`[Retrieve pipeline data]`);
const PROJECT_URL = `/projects/${RENOVATE_PROJECT_ID}`;
const ROOT_DIR = path.join(fileURLToPath(import.meta.url), "..", "..");
const DATA_DIR = path.join(ROOT_DIR, "webapp", "public");

async function addRenovateLogFromArtifacts(job) {
  log(`Loading data for ${job.name}...`);

  const artifactURL = `${PROJECT_URL}/jobs/${job.id}/artifacts/renovate-log.txt`;

  try {
    const { data: logsRaw } = await GitLabAPI.get(artifactURL);

    const renovateLog = logsRaw
      .trim()
      .split(/\n+/)
      .flatMap((x) => {
        try {
          return JSON.parse(x);
        } catch (e) {
          return [];
        }
      });
    return { renovateLog, renovateLogErrors: [] };
  } catch (e) {
    return {
      renovateLog: [
        {
          msg: `Error retrieving renovate log from ${artifactURL}`,
          details: e.msg,
        },
      ],
    };
  }
}

function getMapFn(configs) {
  const jobNameToConfigPaths = Object.fromEntries(
    Object.keys(configs).map((fileName) => [
      configPathToJobName(fileName),
      fileName,
    ])
  );

  return async function getData(job) {
    const configPath = jobNameToConfigPaths[job.name];
    const relPath = path.relative(ROOT_DIR, configPath);
    //TODO: If we run it in-line, this won't be there...
    const finishedAt = new Date(job?.finished_at);
    const mergeRequests = [];

    const currentConfig = configs[configPath];

    const repositories = currentConfig?.repositories || [];

    const results = [];

    const { renovateLog } = await addRenovateLogFromArtifacts(job);

    for (const repositoryConfig of repositories) {
      await forEachMR([repositoryConfig], (mr) => {
        mergeRequests.push(mr);
      });
      const project = await getProjectFromSlug(repositoryConfig.repository);
      const { forked_from_project: upstreamProject } = project;

      results.push({
        name: upstreamProject.path_with_namespace,
        repository: upstreamProject.web_url,
        managers: repositoryConfig.enabledManagers,
        renovateLog,
        mergeRequests,
        job,
        finishedAt: finishedAt.toISOString(),
        durationMs: finishedAt - new Date(job?.created_at),
        configPath: path.relative(ROOT_DIR, configPath),
        configUrl: `${RENOVATE_WEB_URL}/-/blob/main/${relPath}?ref_type=heads`,
        renovateConfig: currentConfig,
      });
    }
    return results;
  };
}

async function getSanitizer() {
  if (!process.env.CI) {
    console.log("No need to sanitize");
    return null;
  }

  const { data: vars } = await GitLabAPI.get(`${PROJECT_URL}/variables`);

  const secrets = vars.flatMap((v) => {
    if (process.env[v.key]) {
      console.log(`Found secret ${v.key}`);
      return process.env[v.key];
    }
    return [];
  });

  return function replacer(key, value) {
    if (secrets.includes(value)) {
      return "*******************";
    }
    return value;
  };
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  let pipelineId = "";

  const { CI_PIPELINE_ID, CI, CI_DEFAULT_BRANCH, CI_COMMIT_BRANCH } =
    process.env;

  if (CI && CI_PIPELINE_ID && CI_DEFAULT_BRANCH === CI_COMMIT_BRANCH) {
    log(`Running on default branch, using CI_PIPELINE_ID: ${CI_PIPELINE_ID}`);
    pipelineId = CI_PIPELINE_ID;
  } else {
    log("Not running on default branch, receiving latest pipeline id");
    const { data: pipeline } = await GitLabAPI.get(
      `${PROJECT_URL}/pipelines/latest`
    );
    log(`Latest pipeline is: ${pipeline.id} (${pipeline.web_url})`);
    pipelineId = pipeline.id;
  }

  const { data: bridges } = await GitLabAPI.get(
    `${PROJECT_URL}/pipelines/${pipelineId}/bridges`
  );
  const childPipeline = bridges.find(
    (x) => x.name === "execute"
  )?.downstream_pipeline;

  if (!childPipeline) {
    throw new Error("Couldn't find Downstream pipeline");
  }

  console.log(`Found childPipeline: ${childPipeline.id}`);

  // TODO: Port gem extraction to node
  process.env.STABLE_REVIEWERS = "true";
  const configs = await loadAllConfigs();

  console.log(`Loaded all configs (${Object.values(configs).length})`);

  const jobIterator = new GitLabAPIIterator(
    `${PROJECT_URL}/pipelines/${childPipeline.id}/jobs`
  );

  const jobs = [];

  for await (const job of jobIterator) {
    if (job.stage !== "build") {
      jobs.push(job);
    }
  }

  const repositoryDetails = [];
  for await (const result of asyncPool(5, jobs, getMapFn(configs))) {
    repositoryDetails.push(...result);
  }

  await writeFile(
    path.join(DATA_DIR, "data.json"),
    JSON.stringify(repositoryDetails, await getSanitizer(), 2),
    "utf-8"
  );
}

main()
  .then(() => {
    log("Done");
  })
  .catch((e) => {
    warn("An error happened");
    warn(e.message);
    warn(e.stack);
    process.exitCode = 1;
  });
