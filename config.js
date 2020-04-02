const baseConfig = {
  lockFileMaintenance: { enabled: false, schedule: [] },
  enabledManagers: ["npm"],
  prConcurrentLimit: 2,
  assignees: [
    "@ealcantara",
    "@jboyson",
    "@lauraMon",
    "@mishunov",
    "@pgascouvaillancourt",
    "@sarahghp",
  ],
  assignAutomerge: true,
  assigneesSampleSize: 2,
  // Only include the first level of dependency files
  includePaths: ["*"],
  // Dedupe yarn dependencies
  postUpdateOptions: ["yarnDedupeFewer"],
};

const updateNothing = {
  packagePatterns: [".*"],
  enabled: false,
};

const updateGitLabScope = {
  enabled: true,
  rangeStrategy: "auto",
};

const productionPackages = ["@gitlab/ui", "@gitlab/svgs"];

const updateGitLabScopeProduction = {
  ...updateGitLabScope,
  packageNames: productionPackages,
  groupName: "GitLab Packages",
};

const updateGitLabScopeDev = {
  ...updateGitLabScope,
  packagePatterns: ["@gitlab/.*"],
  excludePackageNames: productionPackages,
  groupName: "GitLab Dev Packages",
};

const updateSourcegraph = {
  packageNames: ["@sourcegraph/code-host-integration"],
  enabled: true,
  rangeStrategy: "bump",
};

const prBodyNotes = [
  `MR created with the help of [${process.env.CI_PROJECT_PATH}](${process.env.CI_PROJECT_URL})`,
];

const updateOnlyGitLabScope = {
  ...baseConfig,
  prBodyNotes,
  labels: ["frontend", "dependency update", "backstage"],
  packageRules: [
    updateNothing,
    updateGitLabScopeProduction,
    updateGitLabScopeDev,
    updateSourcegraph,
  ],
};

const autoMergeMinorAndPatch = {
  automerge: true,
  major: {
    automerge: false,
  },
};

const gitlab = [
  {
    repository: "gitlab-org/gitlab",
    ...updateOnlyGitLabScope,
    semanticCommits: false,
  },
  {
    repository: "gitlab-org/gitlab-svgs",
    ...updateOnlyGitLabScope,
    semanticCommits: false,
  },
  {
    repository: "gitlab-org/gitlab-ui",
    ...updateOnlyGitLabScope,
    ...autoMergeMinorAndPatch,
    semanticCommits: true,
  },
  {
    repository: "gitlab-org/gitlab-services/design.gitlab.com",
    ...updateOnlyGitLabScope,
    ...autoMergeMinorAndPatch,
    semanticCommits: false,
  },
  // Customer Portal:
  {
    repository: "gitlab-org/customers-gitlab-com",
    ...baseConfig,
    prBodyNotes,
    labels: ["frontend", "dependency update", "backstage"],
    assignees: ["@vitallium"],
    packageRules: [updateNothing, updateGitLabScopeProduction],
    semanticCommits: false,
  },
  {
    repository: "gitlab-org/status-page",
    ...baseConfig,
    ...updateOnlyGitLabScope,
    assignees: ["@lauraMon", "@ohoral", "@oregand", "@tristan.read"],
    semanticCommits: false,
  },
];

const allDependencies = [
  "gitlab-com/teampage-map",
  "gitlab-org/frontend/renovate-gitlab-bot",
];

module.exports = {
  dryRun: process.env.CI_COMMIT_REF_SLUG !== "master",
  autodiscover: false,
  logLevel: "debug",
  platform: "gitlab",
  onboarding: false,
  requireConfig: false,
  printConfig: false,
  gitAuthor: "GitLab Bot <gitlab-bot@gitlab.com>",
  repositories: [
    ...gitlab,
    ...allDependencies.map((repository) => ({
      repository,
      ...baseConfig,
      assignees: ["@leipert"],
      automerge: true,
      prBodyNotes,
      rangeStrategy: "bump",
      packageRules: [
        {
          extends: ["monorepo:jest", "packages:jsUnitTest"],
          groupName: "testing",
        },
        {
          extends: ["monorepo:vue"],
          groupName: "vue monorepo",
        },
        {
          extends: ["packages:linters"],
          packageNames: ["prettier", "pretty-quick", "husky"],
          groupName: "linters and prettier",
        },
      ],
    })),
  ],
};
