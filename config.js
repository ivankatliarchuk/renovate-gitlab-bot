const baseConfig = {
  includeForks: true,
  automerge: false,
  labels: ["frontend", "dependency update", "feature::maintenance"],
  lockFileMaintenance: { enabled: false, schedule: [] },
  enabledManagers: ["npm"],
  prConcurrentLimit: 11,
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

const ESLint = {
  ...updateGitLabScope,
  packageNames: ["@gitlab/eslint-plugin", "eslint"],
  packagePatterns: ["eslint-.+"],
  assignees: ["@markrian", "@vitallium"],
  groupName: "ESLint and related",
};

const updateGitLabScopeDev = {
  ...updateGitLabScope,
  packagePatterns: ["@gitlab/.*"],
  excludePackageNames: [
    ...updateGitLabUIandSVG.packageNames,
    ...updateGitLabVisualReviewTools.packageNames,
    ...ESLint.packageNames,
  ],
  groupName: "GitLab Packages",
};

const updateOnlyGitLabScope = {
  ...baseConfig,
  packageRules: [
    updateNothing,
    updateGitLabUIandSVG,
    ESLint,
    updateGitLabScopeDev,
  ],
};

const updateDOMPurify = {
  packageNames: ["dompurify"],
  rangeStrategy: "bump",
  enabled: true,
  assignees: ["@djadmin", "@markrian"],
};

const foundationPackages = {
  assignees: ["@leipert", "@mikegreiling"],
  addLabels: ["group::ecosystem"],
};

const gitlab = [
  {
    repository: "gitlab-org/gitlab",
    packageRules: [
      {
        ...foundationPackages,
        packagePatterns: [
          ".*-loader",
          ".*-webpack-plugin",
          "webpack-bundle-analyzer",
        ],
        excludePackageNames: [
          "three-stl-loader",
          "karma-sourcemap-loader",
          "jest-raw-loader",
          "monaco-editor-webpack-plugin",
        ],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Webpack related packages",
      },
      {
        ...foundationPackages,
        packageNames: ["webpack", "webpack-cli", "webpack-dev-server"],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Webpack core packages",
      },
      {
        ...foundationPackages,
        packageNames: ["core-js"],
        enabled: true,
        rangeStrategy: "bump",
      },
    ],
  },
  {
    repository: "gitlab-org/gitlab",
    ...baseConfig,
    labels: ["backend", "dependency update", "feature", "feature::maintenance"],
    branchPrefix: "renovate-development-gems/",
    assignees: ["@rymai"],
    enabledManagers: ["bundler"],
    semanticCommits: "disabled",
    packageRules: [
      updateNothing,
      {
        packageNames: [
          "brakeman",
          "danger",
          "lefthook",
          "letter_opener_web",
          "better_errors",
          "thin",
        ],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Ruby development dependencies",
      },
    ],
  },
  {
    repository: "gitlab-org/gitlab",
    ...baseConfig,
    labels: ["backend", "dependency update", "feature", "feature::maintenance"],
    branchPrefix: "renovate-gitlab-tooling-gems/",
    assignees: ["@rymai"],
    enabledManagers: ["bundler"],
    semanticCommits: "disabled",
    packageRules: [
      updateNothing,
      {
        packageNames: [
          "gitlab-styles",
          "gitlab-dangerfiles",
        ],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "GitLab Tooling Ruby dependencies",
      },
    ],
  },
  {
    repository: "gitlab-org/gitlab-svgs",
    ...updateOnlyGitLabScope,
    semanticCommits: "disabled",
  },
  {
    repository: "gitlab-org/gitlab-services/design.gitlab.com",
    ...updateOnlyGitLabScope,
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
  "gitlab-renovate-forks/teampage-map",
  // "gitlab-org/frontend/renovate-gitlab-bot",
];

module.exports = {
  dryRun: process.env.CI_COMMIT_REF_SLUG !== "main",
  autodiscover: false,
  logLevel: "debug",
  platform: "gitlab",
  onboarding: false,
  requireConfig: false,
  printConfig: false,
  gitAuthor: "GitLab Renovate Bot <gitlab-bot@gitlab.com>",
  repositories: [
    {
      repository: "gitlab-renovate-forks/gitlab",
      ...baseConfig,
      packageRules: [
        updateNothing,
        updateGitLabUIandSVG,
        ESLint,
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
          assignees: ["@samdbeckham"],
          packageNames: ["vue-virtual-scroll-list"],
          enabled: true,
          rangeStrategy: "bump",
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
        updateDOMPurify,
      ],
      semanticCommits: "disabled",
    },
    {
      repository: "gitlab-renovate-forks/gitlab-ui",
      ...baseConfig,
      packageRules: [
        updateNothing,
        updateGitLabUIandSVG,
        ESLint,
        updateGitLabScopeDev,
        updateDOMPurify,
        {
          packagePatterns: ["@storybook/.*"],
          assignees: ["@pgascouvaillancourt"],
          rangeStrategy: "bump",
          enabled: true,
          groupName: "Storybook",
        },
      ],
      semanticCommits: "enabled",
    },
    ...allDependencies.map((repository) => ({
      repository,
      ...baseConfig,
      labels: [],
      assignees: ["@leipert"],
      automerge: false,
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
