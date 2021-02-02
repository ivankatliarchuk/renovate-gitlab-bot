const baseConfig = {
  labels: ["frontend", "dependency update", "feature::maintenance"],
  lockFileMaintenance: { enabled: false, schedule: [] },
  enabledManagers: ["npm"],
  prConcurrentLimit: 5,
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

const updateDOMPurify = {
  packageNames: ["dompurify"],
  rangeStrategy: "bump",
  enabled: true,
  assignees: ["@djadmin", "@markrian"],
  automerge: false,
};

const autoMergeMinorAndPatch = {
  automerge: true,
  major: {
    automerge: false,
  },
};

const foundationPackages = {
  assignees: ["@leipert"],
  addLabels: ["group::ecosystem"],
};

const gitlab = [
  {
    repository: "gitlab-org/gitlab",
    ...baseConfig,
    packageRules: [
      updateNothing,
      updateGitLabUIandSVG,
      updateGitLabScopeDev,
      {
        assignees: ["@samdbeckham"],
        packageNames: [
          "vue",
          "vue-loader",
          "vue-router",
          "vue-template-compiler",
          "vuex",
        ],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Vue and related dependencies",
      },
      {
        packagePatterns: ["^@sourcegraph/*"],
        assignees: ["@pslaughter"],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Sourcegraph",
      },
      {
        assignees: ["@ealcantara", "@jerasmus"],
        packagePatterns: ["^@toast-ui/*"],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Toast UI",
      },
      {
        ...foundationPackages,
        packageNames: ["worker-loader"],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Worker Loader",
      },
      {
        ...foundationPackages,
        packageNames: ["core-js"],
        enabled: true,
        rangeStrategy: "bump",
      },
      updateDOMPurify,
    ],
    semanticCommits: "disabled",
  },
  {
    repository: "gitlab-org/gitlab",
    ...baseConfig,
    branchPrefix: "renovate-vue-virtual-scroll-list/",
    assignees: ["@samdbeckham"],
    packageRules: [
      updateNothing,
      {
        packageNames: ["vue-virtual-scroll-list"],
        enabled: true,
        rangeStrategy: "bump",
      },
    ],
    semanticCommits: "disabled",
  },
  {
    repository: "gitlab-org/gitlab",
    ...baseConfig,
    branchPrefix: "renovate-misc/",
    semanticCommits: "disabled",
    packageRules: [
      updateNothing,
      {
        ...foundationPackages,
        packageNames: ["file-loader", "url-loader", "raw-loader"],
        assignees: ["@leipert"],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Misc Loader",
      },
      {
        ...foundationPackages,
        packageNames: ["style-loader"],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Style Loader",
      },
    ],
  },
  {
    repository: "gitlab-org/gitlab-svgs",
    ...updateOnlyGitLabScope,
    ...autoMergeMinorAndPatch,
    semanticCommits: "disabled",
  },
  {
    repository: "gitlab-org/gitlab-ui",
    ...baseConfig,
    packageRules: [
      updateNothing,
      updateGitLabUIandSVG,
      updateGitLabScopeDev,
      updateDOMPurify,
      {
        ...autoMergeMinorAndPatch,
        packagePatterns: ["@storybook/.*"],
        assignees: ["@pgascouvaillancourt"],
        rangeStrategy: "bump",
        enabled: true,
      },
    ],
    ...autoMergeMinorAndPatch,
    semanticCommits: "enabled",
  },
  {
    repository: "gitlab-org/gitlab-services/design.gitlab.com",
    ...updateOnlyGitLabScope,
    ...autoMergeMinorAndPatch,
    semanticCommits: "enabled",
  },
  // Customer Portal:
  {
    repository: "gitlab-org/customers-gitlab-com",
    ...updateOnlyGitLabScope,
    assignees: ["@vitallium"],
    semanticCommits: "disabled",
  },
  {
    repository: "gitlab-org/status-page",
    ...baseConfig,
    ...updateOnlyGitLabScope,
    assignees: ["@ohoral", "@oregand", "@tristan.read"],
    semanticCommits: "disabled",
  },
  {
    repository: "gitlab-org/gitlab-docs",
    ...baseConfig,
    assignees: ["@axil", "@eread", "@marcel.amirault"],
    assigneesSampleSize: 3,
    enabledManagers: ["npm", "bundler"],
    prConcurrentLimit: 4,
    semanticCommits: "disabled",
    packageRules: [
      {
        extends: ["schedule:weekly"],
        packagePatterns: [".+"],
        rangeStrategy: "bump",
        managers: ["bundler"],
        groupName: "Ruby dependencies",
      },
      {
        extends: ["schedule:weekly"],
        packagePatterns: [".+"],
        excludePackageNames: [
          "rollup-plugin-vue",
          "rollup/plugin-node-resolve",
        ],
        rangeStrategy: "bump",
        managers: ["npm"],
        groupName: "NodeJS dependencies",
      },
    ],
  },
  {
    repository: "gitlab-org/gitlab-development-kit",
    ...baseConfig,
    assignees: ["@ashmckenzie", "@tigerwnz", "@toon"],
    enabledManagers: ["npm", "bundler"],
    packageRules: [
      {
        extends: ["schedule:weekly"],
        packagePatterns: [".+"],
        rangeStrategy: "bump",
        managers: ["bundler"],
        groupName: "Ruby dependencies",
      },
    ],
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
        // Disable updating of renovate
        // {
        //   packagePatterns: ["^renovate"],
        //   extends: ["schedule:weekly"],
        // },
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
