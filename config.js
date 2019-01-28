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

const onlyGitLabScope = [
  "gitlab-org/gitlab-ce",
  "gitlab-org/gitlab-svgs",
  "gitlab-org/gitlab-ui",
  "gitlab-org/design.gitlab.com"
];

const allDependencies = [
  "leipert-projects/yarn-why-json",
  "leipert-projects/gettext-extractor-vue",
  "leipert-projects/is-gitlab-pretty-yet",
  "gitlab-com/teampage-map"
];

module.exports = {
  dryRun: process.env.CI_COMMIT_REF_SLUG !== "master",
  autodiscover: false,
  logLevel: "debug",
  platform: "gitlab",
  onboarding: false,
  printConfig: false,
  repositories: [
    ...onlyGitLabScope.map(repository => ({
      repository,
      ...baseConfig,
      prBodyNotes,
      labels: ["frontend", "dependency update", "backstage"],
      packageRules: [updateNothing, updateGitLabScope]
    })),
    ...allDependencies.map(repository => ({
      repository,
      ...baseConfig,
      prBodyNotes,
      rangeStrategy: "bump",
      packageRules: [
        {
          extends: ["monorepo:jest", "packages:jsUnitTest"],
          groupName: "testing"
        },
        {
          extends: ["monorepo:vue"],
          groupName: "vue monorepo"
        },
        {
          extends: ["packages:linters"],
          packageNames: ["prettier", "pretty-quick", "husky"],
          groupName: "linters and prettier"
        }
      ]
    }))
  ]
};
