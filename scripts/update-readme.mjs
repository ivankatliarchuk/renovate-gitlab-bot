#!/usr/bin/env node

import { basename, relative, join } from "node:path";
import { writeFile, readFile } from "node:fs/promises";
import { loadAllConfigs } from "./lib/load-all-configs.mjs";
import * as prettier from "prettier";
import HCL from "js-hcl-parser";

// We do not really care about reviewers at this stage
process.env.STABLE_REVIEWERS = "true";

const repositories = Object.entries(await loadAllConfigs());

const terraformHCL = await readFile(
  join(import.meta.dirname, "..", "forks/config.tfvars"),
  "utf-8"
);

const projects = JSON.parse(HCL.parse(terraformHCL))
  .projects.map(({ path, fork_path }) => {
    const id = fork_path ?? basename(path);
    const fork = `gitlab-renovate-forks/${id}`;
    const configFiles = repositories.flatMap(([path, config]) => {
      return (config?.repositories || []).some((x) => x?.repository === fork)
        ? relative(join(import.meta.dirname, ".."), path)
        : [];
    });

    const links = [
      [id, `https://gitlab.com/${path}`],
      [id + "_fork", `https://gitlab.com/${fork}`],
    ];

    return {
      id,
      origin: path,
      fork,
      configFiles,
      links,
    };
  })
  .sort((a, b) => {
    return a.origin < b.origin ? -1 : 1;
  });

const links = Object.entries(
  Object.fromEntries(projects.flatMap((p) => p.links))
)
  .map(([key, url]) => `[${key}]: ${url}`)
  .join("\n");

const list = projects
  .map(({ configFiles, links }) => {
    const listItem = `| [${links[0][0]}][] | [link][${links[1][0]}] | `;
    if (configFiles.length === 0) {
      return `${listItem} none |`;
    }

    const configs = configFiles.map((y) => `[${y}](./${y})`).join(" <br/> ");

    return `${listItem} ${configs}|`;
  })
  .join("\n");

const delimiter = "<!-- rep -->";

const regex = new RegExp(`${delimiter}[\\s\\S]+${delimiter}`, "gm");

const section = `
${delimiter}

The following ${projects.length} repositories are currently being updated automatically.
A master list of upstream repositories is stored in the [forks/config.tfvars](./forks/config.tfvars) file.

| Project | Fork | Config |
| - | - | - | 
${list}

${links}

${delimiter}
`;

const readme = await readFile("README.md", "utf8");

await writeFile(
  join(import.meta.dirname, "..", "README.md"),
  await prettier.format(readme.replace(regex, section), { parser: "markdown" }),
  "utf-8"
);

console.warn(list);
