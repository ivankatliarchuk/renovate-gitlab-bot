const { join } = require("node:path");
const { execFile, execSync } = require("node:child_process");
const extractor = join(__dirname, "gem_feature_categories.rb");
const axios = require("axios");
const { parse: parseYaml } = require("yaml");
const roulette = require("../roulette.json");
const { availableRouletteReviewerByRole, epBaseConfig } = require("./shared");
const prettier = require("prettier");

const STAGES_URL =
  "https://gitlab.com/gitlab-com/www-gitlab-com/raw/master/data/stages.yml";

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

async function parseStagesFile() {
  const { data } = await axios.get(STAGES_URL);

  return parseYaml(data).stages;
}

async function getRoulette() {
  return roulette;
}

function groupFromCategory(feature_category, groups) {
  return groups.find((group) => group?.categories?.includes(feature_category));
}

function groupsFromStages(stages) {
  return Object.values(stages).flatMap((stage) => {
    return Object.values(stage.groups);
  });
}

function ownersByGroup(team, project, group = {}) {
  const { name, be_team_tag } = group;
  if (!name) {
    return [];
  }
  return team.flatMap((person = {}) => {
    const { specialty: _specialty, projects = {}, departments = [] } = person;
    // Filter out people who don't have a backend role in the project
    const roles = [projects?.[project] ?? []].flat();
    if (!roles.some((role) => role.includes("backend"))) {
      return [];
    }

    // Logic from Handbook https://about.gitlab.com/handbook/product/categories/ page:
    // https://gitlab.com/gitlab-com/content-sites/handbook/-/blob/0074793f86/layouts/partials/categories/developer-count.html#L1-23
    // Lookup the `be_team_tag` in the stages, and it should be part of the person's department
    if (
      be_team_tag &&
      Array.isArray(departments) &&
      departments.some((dep) => dep === be_team_tag)
    ) {
      return person.username;
    }

    // Filter by specialty / group
    const specialty = Array.isArray(_specialty) ? _specialty : [_specialty];
    if (specialty.some((specialty) => specialty?.includes(name))) {
      return person.username;
    }
    // TODO: Filter by availability. Even though we might wanna do that later in the stack

    return [];
  });
}

async function getGemReviewers(gemFile, project) {
  if (process.env.STABLE_REVIEWERS) {
    console.warn("Not executing getGemReviewers...");
    return [];
  }

  console.log("getting gem reviewers");

  const [gems, stages, team] = await Promise.all([
    parseRemoteGemfile(gemFile),
    parseStagesFile(),
    getRoulette(),
  ]);

  const groups = groupsFromStages(stages);

  const logs = [];

  const mapped = Object.entries(gems).map(([name, def]) => {
    const { feature_category } = def;
    let owners;
    let group;

    let log = ` | ${name} | :${feature_category} |`;
    if (feature_category === "shared") {
      log += " available backend maintainers ";
      owners = availableRouletteReviewerByRole(project, "maintainer backend");
    } else if (feature_category === "tooling") {
      log += " engineering productivity ";
      owners = epBaseConfig.reviewers;
      console.warn(`\tReviewers: Engineering Productivity`);
    } else {
      group = groupFromCategory(feature_category, groups);
      owners = ownersByGroup(team, project, group);
      log += ` ${group?.name} group `;
    }
    logs.push(`${log} (${owners.length} people) |`);

    return [
      name,
      {
        ...def,
        group: group?.name ?? "UNKNOWN",
        owners,
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
