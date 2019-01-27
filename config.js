const baseConfig = {
  lockFileMaintenance: { enabled: false, schedule: [] },
  enabledManagers: ["npm"],
  prConcurrentLimit: 1,
  assignees: ["@leipert"]
};

const updateNothing = {
  packagePatterns: [".*"],
  enabled: false
};

const updateGitLabScope = {
  packagePatterns: ["@gitlab/.*"],
  enabled: true,
  rangeStrategy: "bump"
};

const prBodyNotes = [
  "/cc @leipert",
  `MR created with the help of [${process.env.CI_PROJECT_PATH}](${
    process.env.CI_PROJECT_URL
  })`
];

const gitLabRepositories = [
  "gitlab-org/gitlab-ce",
  "gitlab-org/gitlab-svgs",
  "gitlab-org/gitlab-ui"
];

const leipertRepositories = ["leipert-projects/yarn-why-json"];

module.exports = {
  dryRun: process.env.CI_COMMIT_REF_SLUG !== "master",
  autodiscover: false,
  logLevel: "info",
  platform: "gitlab",
  onboarding: false,
  printConfig: false,
  repositories: [
    ...gitLabRepositories.map(repository => ({
      repository,
      ...baseConfig,
      prBodyNotes,
      labels: ["frontend", "dependency update", "backstage"],
      packageRules: [updateNothing, updateGitLabScope]
    })),
    ...leipertRepositories.map(repository => ({
      repository,
      ...baseConfig,
      prBodyNotes,
      rangeStrategy: "bump"
    }))
  ]
};
