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

const leipertRepositories = ["leipert-projects/yarn-why-json"];

module.exports = {
  dryRun: true,
  autodiscover: false,
  platform: "gitlab",
  onboarding: false,
  printConfig: false,
  repositories: [
    ...gitLabRepositories.map(repository => ({
      repository,
      ...baseConfig,
      prBodyNotes: ["/cc @leipert"],
      packageRules: [updateNothing, updateGitLabScope]
    })),
    ...leipertRepositories.map(repository => ({
      repository,
      ...baseConfig,
      prBodyNotes: ["/cc @leipert"],
      rangeStrategy: "bump"
    }))
  ]
};
