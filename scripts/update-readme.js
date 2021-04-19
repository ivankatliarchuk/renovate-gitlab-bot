#!/usr/bin/env node

const fs = require("fs");
const config = require("../renovate/config");

const listItem = (path) => `- [${path}](https://gitlab.com/${path})`;

const repositories = [
  ...new Set(
    config.repositories.map((x) => {
      if (x.repository) {
        return listItem(x.repository);
      }

      return listItem(x);
    })
  ),
]
  .sort()
  .join("\n");

const delimiter = "<!-- rep -->";

const regex = new RegExp(`${delimiter}[\\s\\S]+${delimiter}`, "gm");

const section = `
${delimiter}

${repositories}

${delimiter}
`;

const readme = fs.readFileSync("README.md", "utf8");

fs.writeFileSync("README.md", readme.replace(regex, section));

console.warn(repositories);
