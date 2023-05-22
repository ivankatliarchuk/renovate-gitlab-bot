const fs = require("fs");
const path = require("path");
// TODO: Dry this up later again
const { RENOVATE_BOT_USER, RENOVATE_STOP_UPDATING_LABEL } = {
  RENOVATE_BOT_USER: "gitlab-dependency-update-bot",
  RENOVATE_STOP_UPDATING_LABEL: "automation:bot-no-updates",
};

const GITLAB_REPO = "gitlab-renovate-forks/gitlab";

const CONFIG_DIR = path.join(__dirname, "..");

const team = require("../roulette.json");

const defaultLabels = [
  "maintenance::dependency",
  "type::maintenance",
  "automation:bot-authored",
];

const foundationLabels = [
  ...defaultLabels,
  "group::foundations",
  "devops::manage",
  "section::dev",
];

const epBaseConfig = {
  reviewers: [
    "alinamihaila",
    "ashmckenzie",
    "ddieulivol",
    "godfat-gitlab",
    "jennli",
    "nao.hashizume",
    "rymai",
  ],
  reviewersSampleSize: 1,
  labels: [...defaultLabels, "backend", "Engineering Productivity"],
};

const qaBaseConfig = {
  reviewers: [
    "acunskis",
    "a_mcdonald",
    "chloeliu",
    "ddavison",
    "mlapierre",
    "sliaquat",
    "treagitlab",
  ],
  reviewersSampleSize: 1,
  labels: [...defaultLabels, "Quality"],
};

const mandatoryRepositoryConfig = {
  // Needed to work properly, because of the forked workflow
  includeForks: true,
  // Due to our review requirements we cannot automerge MRs
  automerge: false,
  // Once an MR is approved, this label will be set, stopping renovate from messing with the MR
  stopUpdatingLabel: RENOVATE_STOP_UPDATING_LABEL,
  // These host rules are needed due to API limits
  hostRules: [
    process.env.GITHUB_TOKEN
      ? {
          matchHost: "github.com",
          token: process.env.GITHUB_TOKEN,
        }
      : [],
    process.env.RENOVATE_TOKEN
      ? {
          matchHost: "gitlab.com",
          token: process.env.RENOVATE_TOKEN,
        }
      : [],
  ].flat(),
};

const baseConfig = {
  // Default settings
  dependencyDashboard: true,
  prBodyNotes: [
    `MR created with the help of [${process.env.CI_PROJECT_PATH}](${process.env.CI_PROJECT_URL})`,
  ],
  lockFileMaintenance: { enabled: false, schedule: [] },
  prConcurrentLimit: 20,
  // We assign the Renovate Bot User to this
  assignees: [RENOVATE_BOT_USER],
  reviewersSampleSize: 2,
  // Only include the first level of dependency files
  // in order to avoid long scanning times
  includePaths: ["*"],
};

const updateNothing = {
  matchPackagePatterns: [".*"],
  enabled: false,
};

const semanticPrefixFixDepsChoreOthers = [
  {
    matchPackagePatterns: ["*"],
    semanticCommitType: "chore",
  },
  {
    matchDepTypes: ["dependencies", "require"],
    semanticCommitType: "fix",
  },
];

function validatePackageRules(packageRules = []) {
  for (const rule of packageRules) {
    if (rule.reviewersSampleSize) {
      throw new Error(`
      Our renovate bot only supports setting \`reviewersSampleSize\` on the repository config level.
      Please fix ${JSON.stringify(rule, null, 2)}.
      `);
    }
  }
}

function normalizeRepoConfig(repos) {
  const result = [];
  const extraServerConfig = {};

  for (const repository of repos) {
    for (const field of ["labels", "reviewers", "enabledManagers"]) {
      if (!Object.hasOwn(repository, field)) {
        throw new Error(
          `'${field}' is a required inside the repository config`
        );
      }
    }

    for (const field of Object.keys(mandatoryRepositoryConfig)) {
      if (Object.hasOwn(repository, field)) {
        throw new Error(
          `Do not set '${field}' in the repository config. It cannot be overwritten, because otherwise renovate might behave incorrectly.`
        );
      }
    }

    // Blobless checkouts time out for the GitLab repo.
    // We are forcing a full clone, until we have maybe a better strategy
    // https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/issues/42
    if (repository.repository === GITLAB_REPO) {
      extraServerConfig.fullClone = true;
    }

    validatePackageRules(repository.packageRules);

    if (repository?.enabledManagers?.includes("npm")) {
      repository.postUpdateOptions ||= [];
      if (!repository.postUpdateOptions.includes("yarnDedupeFewer")) {
        repository.postUpdateOptions.push("yarnDedupeFewer");
      }
    }

    result.push({
      ...repository,
      ...mandatoryRepositoryConfig,
    });
  }

  return [result, extraServerConfig];
}

/**
 *
 * @param repos
 * @param serverConfig
 * @returns Renovate Config
 */
function createServerConfig(repos, serverConfig = {}) {
  const [repositories, extraServerConfig] = normalizeRepoConfig(repos);

  return {
    dryRun: (process.env.DRY_RUN ?? "true") === "true" ? "full" : null,
    autodiscover: false,
    binarySource: "global",
    logFile: path.join(CONFIG_DIR, "..", "renovate-log.txt"),
    logFileLevel: "debug",
    platform: "gitlab",
    onboarding: false,
    requireConfig: "ignored",
    printConfig: false,
    renovateMetaCommentTemplate: fs.readFileSync(
      path.join(CONFIG_DIR, "comment_templates", "default.md"),
      "utf-8"
    ),
    gitAuthor: "GitLab Renovate Bot <gitlab-bot@gitlab.com>",
    ...extraServerConfig,
    ...serverConfig,
    repositories,
  };
}

function availableRouletteReviewerByRole(project, role = "maintainer") {
  const roles = [role].flat();
  const candidates = team.filter((person) =>
    roles.some((r) => [person?.projects?.[project]].flat().includes(r))
  );

  if (candidates.length === 0) {
    throw new Error(
      `Found no candidates for project: ${project} with role: ${role}`
    );
  }

  if (process.env.STABLE_REVIEWERS) {
    return [project, roles];
  }

  let available = candidates.filter((person) => person.available);

  if (available.length === 0) {
    console.warn(
      `${project}, no ${role} available. Falling back to _all_ ${role}.`
    );
    available = candidates;
  }
  return available.map((person) => person.username);
}

module.exports = {
  GITLAB_REPO,
  createServerConfig,
  defaultLabels,
  foundationLabels,
  epBaseConfig,
  qaBaseConfig,
  baseConfig,
  updateNothing,
  semanticPrefixFixDepsChoreOthers,
  availableRouletteReviewerByRole,
};
