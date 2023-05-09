#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import glob from "glob";
import { program } from "commander";
import { getVersionRegistry } from "./lib/asdf.mjs";
import { loadRenovateConfig } from "./lib/renovate.mjs";
import {
  jobNameFromTools,
  serializeBuildImageJob,
  serializeExecutionJob,
} from "./lib/generate-ci-yaml.mjs";
import { serializeDockerFile } from "./lib/generate-docker-files.mjs";
import axios from "axios";

const ROOT_DIR = path.join(fileURLToPath(import.meta.url), "..", "..");
const CONFIG_DIR = path.join(ROOT_DIR, "renovate");

const BASE_IMAGE_NAME = process.env.BASE_IMAGE ?? "renovate:latest";

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
  const dockerFiles = [];

  for (const { file, needToBeInstalled } of configs) {
    const baseName = jobNameFromTools(needToBeInstalled);

    const imageName = BASE_IMAGE_NAME.replace(
      "renovate:",
      `renovate-${baseName}:`
    );
    jobs[baseName] ||= serializeBuildImageJob(baseName, imageName);

    const job = serializeExecutionJob(
      path.relative(CONFIG_DIR, file),
      baseName,
      imageName
    );
    const jobName = path
      .relative(CONFIG_DIR, file)
      .replace(/\W/g, "-")
      .replace(/-+/g, "-");

    dockerFiles[baseName] ||= {
      path: resolvePath(options.dockerFiles, `./${baseName}.Dockerfile`),
      tools: needToBeInstalled,
      jobs: [],
    };
    dockerFiles[baseName].jobs.push(jobName);
    jobs[jobName] = job;
  }

  if (ciFile) {
    await writeFile(ciFile, JSON.stringify(jobs, null, 2), "utf-8");
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
