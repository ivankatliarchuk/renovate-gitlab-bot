const { join } = require("node:path");
const { execFile, execSync } = require("node:child_process");
const extractor = join(__dirname, "gem_feature_categories.rb");
const axios = require("axios");
const { parse: parseYaml } = require("yaml");
const roulette = require("../roulette.json");
const { availableRouletteReviewerByRole, epBaseConfig } = require("./shared");
const prettier = require("prettier");

const GROUPS_URL = "https://about.gitlab.com/groups.json";

function parseGemfile(inputStream) {
  return new Promise((resolve, reject) => {
    const child = execFile(extractor);

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data;
    });

    child.stderr.on("data", (data) => {
      stderr += stderr;
    });

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      if (code === 0) {
        resolve({ stderr, stdout });
      }
    });

    inputStream.pipe(child.stdin);
  });
}

async function parseRemoteGemfile(url) {
  const response = await axios.get(url, {
    responseType: "stream",
  });

  const { stdout } = await parseGemfile(response.data);
  return JSON.parse(stdout);
}

async function parseGroupsFile() {
  const { data } = await axios.get(GROUPS_URL);

  return Object.values(data);
}

async function getRoulette() {
  return roulette;
}

function groupFromCategory(feature_category, groups) {
  return groups.find((group) => group?.categories?.includes(feature_category));
}

function ownersByGroup(team, project, group = {}) {
  const { name, backend_engineers } = group;
  if (!name) {
    return [];
  }
  return team.flatMap((person = {}) => {
    const { specialty, projects = {}, available } = person;
    if (!available) {
      return [];
    }

    // Filter out people who don't have a backend role in the project
    const roles = [projects?.[project] ?? []].flat();
    if (
      project === "gitlab" &&
      !roles.some((role) => role.includes("backend"))
    ) {
      return [];
    }

    if (backend_engineers.includes(person.username)) {
      return person.username;
    }

    // Filter by specialty / group
    const specialties = Array.isArray(specialty) ? specialty : [specialty];
    if (specialties.some((specialty) => specialty?.includes(name))) {
      return person.username;
    }

    return [];
  });
}

async function getGemReviewers(gemFile, project) {
  if (process.env.STABLE_REVIEWERS) {
    console.warn("Not executing getGemReviewers...");
    return [];
  }

  console.log("getting gem reviewers");

  const [gems, groups, team] = await Promise.all([
    parseRemoteGemfile(gemFile),
    parseGroupsFile(),
    getRoulette(),
  ]);

  const logs = [];

  const mapped = Object.entries(gems).map(([name, def]) => {
    const { feature_category } = def;
    let owners;
    let group;
    let log = ` | ${name} | :${feature_category} |`;
    let rouletteProject = project;

    if (feature_category === "gitaly") {
      rouletteProject = "gitaly";
    }

    switch (feature_category) {
      case "shared":
        log += " available backend maintainers ";
        owners = availableRouletteReviewerByRole(
          rouletteProject,
          "maintainer backend"
        );
        break;
      case "tooling":
        log += " engineering productivity ";
        owners = epBaseConfig.reviewers;
        console.warn(`\tReviewers: Engineering Productivity`);
        break;
      default:
        group = groupFromCategory(feature_category, groups);
        owners = ownersByGroup(team, rouletteProject, group);
        log += ` ${group?.name} group (rouletteProject: ${rouletteProject}) `;
        break;
    }

    logs.push(`${log} (${owners.length} people) |`);

    return [
      name,
      {
        ...def,
        group: group?.name ?? "UNKNOWN",
        owners,
        groupLabel: group?.label ?? null,
      },
    ];
  });

  console.warn(
    await prettier.format(
      ["| gem | feature_category | reviewer |", "| - | - | - |", ...logs].join(
        "\n"
      ),
      { parser: "markdown" }
    )
  );

  return Object.fromEntries(mapped);
}

module.exports = {
  getGemReviewers,
};
