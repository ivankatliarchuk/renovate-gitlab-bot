#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import glob from "glob";
import { program } from "commander";
import { getVersionRegistry } from "./lib/asdf.mjs";
import { loadRenovateConfig } from "./lib/renovate.mjs";
import {
  serializeBuildImageJob,
  serializeExecutionJob,
} from "./lib/generate-ci-yaml.mjs";
import { serializeDockerFile } from "./lib/generate-docker-files.mjs";
import axios from "axios";

const ROOT_DIR = path.join(fileURLToPath(import.meta.url), "..", "..");
const CONFIG_DIR = path.join(ROOT_DIR, "renovate");

function resolvePath(p, ...rest) {
  if (!p) {
    return p;
  }
  return path.resolve(path.isAbsolute(p) ? p : process.cwd(), p, ...rest);
}

async function main() {
  program
    .option("--ci-file <path>")
    .option("--docker-files <path>")
    .option("--roulette-file <path>");

  program.parse();

  const options = program.opts();

  const rouletteFile = resolvePath(options.rouletteFile);
  if (rouletteFile) {
    await mkdir(path.dirname(rouletteFile), { recursive: true });
    const { data } = await axios.get(
      "https://gitlab-org.gitlab.io/gitlab-roulette/roulette.json"
    );
    await writeFile(rouletteFile, JSON.stringify(data, null, 2), "utf-8");
    console.log("Downloaded roulette json");
  }

  const ciFile = resolvePath(options.ciFile);

  const configFiles = glob
    .sync(path.join(CONFIG_DIR, "**", "*.config.js"))
    .sort();

  process.env.STABLE_REVIEWERS = "true";
  const configs = await Promise.all(configFiles.map(loadRenovateConfig));

  const jobs = {};
  const dockerFiles = {};

  for (const { file, needToBeInstalled } of configs) {
    const {
      jobName: buildImageJobName,
      jobDefinition: buildImageJobDefinition,
      imageName,
    } = serializeBuildImageJob(needToBeInstalled);

    jobs[buildImageJobName] ||= buildImageJobDefinition;

    const { jobName, jobDefinition } = serializeExecutionJob(
      path.relative(CONFIG_DIR, file),
      buildImageJobName,
      imageName
    );

    dockerFiles[buildImageJobName] ||= {
      path: resolvePath(
        options.dockerFiles,
        `./${buildImageJobName}.Dockerfile`
      ),
      tools: needToBeInstalled,
      jobs: [],
    };
    dockerFiles[buildImageJobName].jobs.push(jobName);
    jobs[jobName] = jobDefinition;
  }

  if (ciFile) {
    const ciFileDefinition = {
      stages: [...new Set(Object.values(jobs).map((j) => j.stage))],
      ...jobs,
    };
    await writeFile(ciFile, JSON.stringify(ciFileDefinition, null, 2), "utf-8");
  } else {
    console.log(JSON.stringify(jobs, null, 2));
  }

  console.warn("Version Registry", getVersionRegistry());

  if (options.dockerFiles) {
    await mkdir(resolvePath(options.dockerFiles), { recursive: true });
    await Promise.all(Object.values(dockerFiles).map(serializeDockerFile));
  }

  console.warn("Docker Files", dockerFiles);
}

await main();
