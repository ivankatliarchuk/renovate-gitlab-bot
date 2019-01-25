const baseConfig = {
  lockFileMaintenance: { enabled: false, schedule: [] },
  enabledManagers: ["npm"],
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

const gitLabRepositories = [
  "leipert/gitlab-ce",
];

const prBodyNotes = [
  "/cc @leipert",
  `Created by [${process.env.CI_PROJECT_PATH}](${process.env.CI_PROJECT_URL})`
];

const leipertRepositories = ["leipert-projects/yarn-why-json"];

module.exports = {
  dryRun: process.env.CI_COMMIT_REF_SLUG !== "master",
  autodiscover: false,
  platform: "gitlab",
  onboarding: false,
  printConfig: false,
  repositories: [
    ...gitLabRepositories.map(repository => ({
      repository,
      ...baseConfig,
      prBodyNotes,
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
