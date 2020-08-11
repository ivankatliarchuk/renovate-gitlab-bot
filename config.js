const baseConfig = {
  labels: ["frontend", "dependency update", "feature::maintenance"],
  lockFileMaintenance: { enabled: false, schedule: [] },
  enabledManagers: ["npm"],
  prConcurrentLimit: 2,
  assignees: [
    "@dmishunov",
    "@ealcantara",
    "@jboyson",
    "@pgascouvaillancourt",
    "@sarahghp",
  ],
  assignAutomerge: true,
  assigneesSampleSize: 2,
  // Only include the first level of dependency files
  includePaths: ["*"],
  // Dedupe yarn dependencies
  postUpdateOptions: ["yarnDedupeFewer"],
  prBodyNotes: [
    `MR created with the help of [${process.env.CI_PROJECT_PATH}](${process.env.CI_PROJECT_URL})`,
  ],
  hostRules: process.env.GITHUB_TOKEN
    ? [
        {
          domainName: "github.com",
          token: process.env.GITHUB_TOKEN,
        },
      ]
    : [],
};

const updateNothing = {
  packagePatterns: [".*"],
  enabled: false,
};

const updateGitLabScope = {
  enabled: true,
  rangeStrategy: "auto",
};

const updateGitLabUIandSVG = {
  ...updateGitLabScope,
  packageNames: ["@gitlab/ui", "@gitlab/svgs"],
  groupName: "GitLab UI/SVG",
};

const updateGitLabVisualReviewTools = {
  ...updateGitLabScope,
  packageNames: ["@gitlab/visual-review-tools"],
  groupName: "GitLab Visual Review Tools",
};

const updateGitLabScopeDev = {
  ...updateGitLabScope,
  packagePatterns: ["@gitlab/.*"],
  excludePackageNames: [
    ...updateGitLabUIandSVG.packageNames,
    ...updateGitLabVisualReviewTools.packageNames,
  ],
  groupName: "GitLab Packages",
};

const updateOnlyGitLabScope = {
  ...baseConfig,
  packageRules: [updateNothing, updateGitLabUIandSVG, updateGitLabScopeDev],
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
    repository: "gitlab-org/gitlab",
    ...baseConfig,
    branchPrefix: "renovate-vue/",
    assignees: ["@leipert"],
    packageRules: [
      updateNothing,
      {
        packageNames: ["vue", "vue-loader", "vue-template-compiler"],
        enabled: true,
        groupName: "Vue and related dependencies",
      },
      {
        packageNames: ["vue-router"],
        rangeStrategy: "bump",
        enabled: true,
      },
      {
        packageNames: ["vuex"],
        rangeStrategy: "bump",
        enabled: true,
      },
    ],
    semanticCommits: false,
  },
  {
    repository: "gitlab-org/gitlab",
    ...baseConfig,
    branchPrefix: "renovate-sourcegraph/",
    assignees: ["@pslaughter"],
    packageRules: [
      updateNothing,
      {
        packagePatterns: ["^@sourcegraph/*"],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Sourcegraph",
      },
    ],
    semanticCommits: false,
  },
  {
    repository: "gitlab-org/gitlab",
    ...baseConfig,
    branchPrefix: "renovate-toast/",
    assignees: ["@ealcantara", "@derek-knox", "@jerasmus"],
    packageRules: [
      updateNothing,
      {
        packagePatterns: ["^@toast-ui/*"],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Toast UI",
      },
    ],
    semanticCommits: false,
  },
  {
    repository: "gitlab-org/gitlab-svgs",
    ...updateOnlyGitLabScope,
    ...autoMergeMinorAndPatch,
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
    semanticCommits: true,
  },
  // Customer Portal:
  {
    repository: "gitlab-org/customers-gitlab-com",
    ...updateOnlyGitLabScope,
    assignees: ["@vitallium"],
    semanticCommits: false,
  },
  {
    repository: "gitlab-org/status-page",
    ...baseConfig,
    ...updateOnlyGitLabScope,
    assignees: ["@ohoral", "@oregand", "@tristan.read"],
    semanticCommits: false,
  },
];

const allDependencies = [
  "gitlab-com/teampage-map",
  "gitlab-org/frontend/renovate-gitlab-bot",
];

module.exports = {
  dryRun: process.env.CI_COMMIT_REF_SLUG !== "main",
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
      labels: [],
      assignees: ["@leipert"],
      automerge: true,
      rangeStrategy: "bump",
      packageRules: [
        {
          packagePatterns: ["^renovate"],
          extends: ["schedule:weekly"],
        },
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
