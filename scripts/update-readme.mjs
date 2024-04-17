#!/usr/bin/env node

import { writeFile, readFile } from "node:fs/promises";
import { loadAllConfigs } from "./lib/load-all-configs.mjs";
import * as prettier from "prettier";

// We do not really care about reviewers at this stage
process.env.STABLE_REVIEWERS = "true";

const repositories = Object.values(await loadAllConfigs()).flatMap(
  (config) => config.repositories
);

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

const readme = await readFile("README.md", "utf8");

await writeFile(
  "README.md",
  await prettier.format(readme.replace(regex, section), { parser: "markdown" }),
  "utf-8"
);

console.warn(list);
