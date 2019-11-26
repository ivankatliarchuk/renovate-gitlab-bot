const baseConfig = {
  lockFileMaintenance: { enabled: false, schedule: [] },
  enabledManagers: ["npm"],
  prConcurrentLimit: 1,
  assignees: ["@pgascouvaillancourt"],
  // Only include the first level of dependency files
  includePaths: ["*"],
  // Dedupe yarn dependencies
  postUpdateOptions: ["yarnDedupeFewer"]
};

const updateNothing = {
  packagePatterns: [".*"],
  enabled: false
};

const updateGitLabScope = {
  packagePatterns: ["@gitlab/.*"],
  enabled: true,
  rangeStrategy: "bump",
  groupName: "GitLab Packages"
};

const updateSourcegraph = {
  packageNames: ["@sourcegraph/code-host-integration"],
  enabled: true,
  rangeStrategy: "bump"
};

const prBodyNotes = [
  "/cc @leipert",
  `MR created with the help of [${process.env.CI_PROJECT_PATH}](${process.env.CI_PROJECT_URL})`
];

const updateOnlyGitLabScope = {
  ...baseConfig,
  prBodyNotes,
  labels: ["frontend", "dependency update", "backstage"],
  packageRules: [updateNothing, updateGitLabScope, updateSourcegraph]
};

const autoMergeMinorAndPatch = {
  "automerge": true,
  "major": {
    "automerge": false
  }
};

const gitlab = [
  {
    repository: "gitlab-org/gitlab",
    ...updateOnlyGitLabScope,
    semanticCommits: false
  },
  {
    repository: "gitlab-org/gitlab-svgs",
    ...updateOnlyGitLabScope,
    semanticCommits: false
  },
  {
    repository: "gitlab-org/gitlab-ui",
    ...updateOnlyGitLabScope,
    semanticCommits: true
  },
  {
    repository: "gitlab-org/gitlab-services/design.gitlab.com",
    ...updateOnlyGitLabScope,
    ...autoMergeMinorAndPatch,
    semanticCommits: false,
  }
];

const allDependencies = ["gitlab-com/teampage-map"];

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
    ...allDependencies.map(repository => ({
      repository,
      ...baseConfig,
      assignees: ["@leipert"],
      automerge: true,
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
