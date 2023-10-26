#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import glob from "glob";
import { loadRawRenovateConfig } from "../bot_image/lib/load-raw-renovate-config.mjs";

const ROOT_DIR = path.join(fileURLToPath(import.meta.url), "..", "..");

const configFiles = glob.sync(
  path.join(ROOT_DIR, "renovate", "**", "*.config.js")
);

const configs = await Promise.all(configFiles.map(loadRawRenovateConfig));
const repositories = configs.flatMap((config) => config.repositories);

console.log(repositories);

const listItem = (path) => `- [${path}](https://gitlab.com/${path})`;

const list = [
  ...new Set(
    repositories.map((x) => {
      return listItem(x?.repository);
    })
  ),
]
  .sort()
  .join("\n");

const delimiter = "<!-- rep -->";

const regex = new RegExp(`${delimiter}[\\s\\S]+${delimiter}`, "gm");

const section = `
${delimiter}

${list}

${delimiter}
`;

const readme = fs.readFileSync("README.md", "utf8");

fs.writeFileSync("README.md", readme.replace(regex, section));

console.warn(list);
