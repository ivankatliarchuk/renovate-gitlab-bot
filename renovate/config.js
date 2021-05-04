const fs = require("fs");
const path = require("path");

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
  matchPackagePatterns: [".*"],
  enabled: false,
};

const updateGitLabScope = {
  enabled: true,
  rangeStrategy: "auto",
};

const updateGitLabUIandSVG = {
  ...updateGitLabScope,
  matchPackageNames: ["@gitlab/ui", "@gitlab/svgs"],
  groupName: "GitLab UI/SVG",
};

const updateGitLabVisualReviewTools = {
  ...updateGitLabScope,
  matchPackageNames: ["@gitlab/visual-review-tools"],
  groupName: "GitLab Visual Review Tools",
};

const ESLint = {
  ...updateGitLabScope,
  matchPackageNames: ["@gitlab/eslint-plugin", "eslint"],
  matchPackagePatterns: ["eslint-.+"],
  assignees: ["@markrian", "@vitallium"],
  groupName: "ESLint and related",
};

const updateGitLabScopeDev = {
  ...updateGitLabScope,
  matchPackagePatterns: ["@gitlab/.*"],
  excludePackageNames: [
    ...updateGitLabUIandSVG.matchPackageNames,
    ...updateGitLabVisualReviewTools.matchPackageNames,
    ...ESLint.matchPackageNames,
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
  matchPackageNames: ["dompurify"],
  rangeStrategy: "bump",
  enabled: true,
  assignees: ["@djadmin", "@markrian"],
};

const foundationPackages = {
  assignees: ["@leipert", "@mikegreiling"],
  addLabels: ["group::ecosystem"],
};

const gitlab = [
  // Customer Portal:
  {
    repository: "gitlab-org/customers-gitlab-com",
    ...updateOnlyGitLabScope,
    assignees: ["@vitallium"],
    semanticCommits: "disabled",
  },
];

module.exports = {
  dryRun: (process.env.DRY_RUN ?? "true") === "true",
  autodiscover: false,
  logFile: path.join(__dirname, "..", "renovate-log.txt"),
  logFileLevel: "debug",
  platform: "gitlab",
  onboarding: false,
  requireConfig: false,
  printConfig: false,
  renovateMetaCommentTemplate: fs.readFileSync(
    path.join(__dirname, "comment_template.md"),
    "utf-8"
  ),
  gitAuthor: "GitLab Renovate Bot <gitlab-bot@gitlab.com>",
  repositories: [
    {
      repository: "gitlab-renovate-forks/gitlab",
      ...baseConfig,
      packageRules: [
        updateNothing,
        updateGitLabUIandSVG,
        updateGitLabVisualReviewTools,
        ESLint,
        updateGitLabScopeDev,
        {
          ...foundationPackages,
          matchPackagePatterns: [
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
          minor: {
            groupName: "Webpack related packages",
          },
          patch: {
            groupName: "Webpack related packages",
          },
          enabled: true,
          rangeStrategy: "bump",
        },
        {
          ...foundationPackages,
          matchPackageNames: ["webpack", "webpack-cli", "webpack-dev-server"],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Webpack core packages",
        },
        {
          ...foundationPackages,
          matchPackageNames: ["core-js"],
          enabled: true,
          rangeStrategy: "bump",
        },
        {
          assignees: ["@samdbeckham"],
          matchPackageNames: [
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
          matchPackageNames: ["vue-virtual-scroll-list"],
          enabled: true,
          rangeStrategy: "bump",
        },
        {
          matchPackagePatterns: ["^@sourcegraph/*"],
          assignees: ["@pslaughter"],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Sourcegraph",
        },
        {
          assignees: ["@ealcantara", "@jerasmus"],
          matchPackagePatterns: ["^@toast-ui/*"],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Toast UI",
        },
        updateDOMPurify,
      ],
      semanticCommits: "disabled",
    },
    {
      repository: "gitlab-renovate-forks/gitlab",
      ...baseConfig,
      labels: [
        "backend",
        "dependency update",
        "feature",
        "feature::maintenance",
      ],
      branchPrefix: "renovate-gems/",
      assignees: ["@rymai"],
      enabledManagers: ["bundler"],
      semanticCommits: "disabled",
      packageRules: [
        updateNothing,
        {
          matchPackageNames: [
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
        {
          matchPackageNames: ["gitlab-styles", "gitlab-dangerfiles"],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "GitLab Tooling Ruby dependencies",
        },
      ],
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
          matchPackagePatterns: [
            "bootstrap-vue",
            // "bootstrap", // comment in, once we are up to date for bootstrap vue
          ],
          // hack to update minor version by minor version
          allowedVersions: "<2.18.0",
          separateMultipleMajor: true,
          assignees: ["@pgascouvaillancourt"],
          rangeStrategy: "bump",
          enabled: true,
          groupName: "Bootstrap Vue",
        },
        {
          matchPackagePatterns: ["@storybook/.*"],
          assignees: ["@pgascouvaillancourt"],
          rangeStrategy: "bump",
          enabled: true,
          groupName: "Storybook",
        },
      ],
      semanticCommits: "enabled",
    },
    {
      repository: "gitlab-renovate-forks/gitlab-svgs",
      ...updateOnlyGitLabScope,
      semanticCommits: "disabled",
    },
    {
      repository: "gitlab-renovate-forks/design.gitlab.com",
      ...updateOnlyGitLabScope,
      semanticCommits: "enabled",
    },
    {
      repository: "gitlab-renovate-forks/status-page",
      ...baseConfig,
      ...updateOnlyGitLabScope,
      assignees: ["@ohoral", "@oregand", "@tristan.read"],
      semanticCommits: "disabled",
    },
    {
      repository: "gitlab-renovate-forks/gitlab-development-kit",
      ...baseConfig,
      assignees: ["@ashmckenzie", "@tigerwnz", "@toon"],
      enabledManagers: ["npm", "bundler"],
      packageRules: [
        {
          extends: ["schedule:weekly"],
          matchPackagePatterns: [".+"],
          rangeStrategy: "bump",
          matchManagers: ["bundler"],
          groupName: "Ruby dependencies",
        },
      ],
    },
    {
      repository: "gitlab-renovate-forks/gitlab-docs",
      ...baseConfig,
      assignees: ["@axil", "@eread", "@marcel.amirault"],
      assigneesSampleSize: 3,
      enabledManagers: ["npm", "bundler"],
      prConcurrentLimit: 4,
      semanticCommits: "disabled",
      packageRules: [
        {
          extends: ["schedule:weekly"],
          matchPackagePatterns: [".+"],
          rangeStrategy: "bump",
          matchManagers: ["bundler"],
          groupName: "Ruby dependencies",
        },
        {
          extends: ["schedule:weekly"],
          matchPackagePatterns: [".+"],
          excludePackageNames: [
            "rollup-plugin-vue",
            "rollup/plugin-node-resolve",
          ],
          rangeStrategy: "bump",
          matchManagers: ["npm"],
          groupName: "NodeJS dependencies",
        },
      ],
    },
    {
      repository: "gitlab-renovate-forks/teampage-map",
      ...baseConfig,
      labels: [],
      assignees: ["@leipert"],
      automerge: false,
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
          matchPackageNames: ["prettier", "pretty-quick", "husky"],
          groupName: "linters and prettier",
        },
      ],
    },
  ],
};
