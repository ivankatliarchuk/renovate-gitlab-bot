const { join } = require("node:path");
const { execFile, execSync } = require("node:child_process");
const extractor = join(__dirname, "gem_feature_categories.rb");
const axios = require("axios");
const { parse: parseYaml } = require("yaml");
const roulette = require("../roulette.json");

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
    console.log(stage);
    return Object.values(stage.groups);
  });
}

function ownersByGroupName(team, project, groupName) {
  if (!groupName) {
    return [];
  }

  return team.flatMap((person) => {
    // Filter by specialty / group
    const specialty = Array.isArray(person?.specialty)
      ? person?.specialty
      : [person?.specialty];
    if (!specialty.some((specialty) => specialty?.includes(groupName))) {
      return [];
    }
    // Filter by backend
    const roles = [person?.projects?.[project] ?? []].flat();
    if (!roles.some((role) => role.includes("backend"))) {
      return [];
    }
    // TODO: Filter by availability. Even though we might wanna do that later in the stack
    return person.username;
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

  const mapped = Object.entries(gems).map(([name, def]) => {
    const group = groupFromCategory(def.feature_category, groups);

    const owners = ownersByGroupName(team, project, group?.name);

    return [
      name,
      {
        ...def,
        group: group?.name ?? "UNKNOWN",
        owners,
      },
    ];
  });

  return Object.fromEntries(mapped);
}

module.exports = {
  getGemReviewers,
};
