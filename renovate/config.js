const fs = require("fs");
const path = require("path");

const baseConfig = {
  includeForks: true,
  automerge: false,
  labels: ["frontend", "dependency update", "type::maintenance"],
  lockFileMaintenance: { enabled: false, schedule: [] },
  enabledManagers: ["npm"],
  prConcurrentLimit: 20,
  assignees: [
    "@dmishunov",
    "@ealcantara",
    "@pgascouvaillancourt",
    "@mikegreiling",
    "@ohoral",
    "@markrian",
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

const Stylelint = {
  ...updateGitLabScope,
  matchPackageNames: ["@gitlab/stylelint-config"],
  matchPackagePatterns: ["stylelint-.+"],
  assignees: ["@vitallium", "@pgascouvaillancourt"],
  groupName: "Stylelint and related",
};

const updateGitLabScopeDev = {
  ...updateGitLabScope,
  matchPackagePatterns: ["@gitlab/.*"],
  excludePackageNames: [
    ...updateGitLabUIandSVG.matchPackageNames,
    ...updateGitLabVisualReviewTools.matchPackageNames,
    ...ESLint.matchPackageNames,
    ...Stylelint.matchPackageNames,
  ],
  groupName: "GitLab Packages",
};

const updateOnlyGitLabScopePackageRules = [
  updateNothing,
  updateGitLabUIandSVG,
  ESLint,
  Stylelint,
  updateGitLabScopeDev,
];

const updateOnlyGitLabScope = {
  ...baseConfig,
  packageRules: updateOnlyGitLabScopePackageRules,
};

const updateFrontendObservability = {
  matchPackagePatterns: ["@sentry/browser"],
  rangeStrategy: "bump",
  enabled: true,
  assignees: ["@jivanvl"],
  groupName: "Frontend Observability Packages",
};

const updateDOMPurify = {
  matchPackageNames: ["dompurify"],
  rangeStrategy: "bump",
  enabled: true,
  assignees: ["@djadmin", "@markrian"],
};

const foundationPackages = {
  assignees: ["@leipert", "@mikegreiling"],
  addLabels: ["group::foundations"],
};

const semanticPrefixFixDepsChoreOthers = [
  {
    matchPackagePatterns: ["*"],
    semanticCommitType: "chore",
  },
  {
    matchDepTypes: ["dependencies", "require"],
    semanticCommitType: "fix",
  },
];

const enableWithBumpStrategy = {
  rangeStrategy: "bump",
  enabled: true,
};

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
        Stylelint,
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
          ...foundationPackages,
          matchPackageNames: ["commander"],
          enabled: true,
          rangeStrategy: "bump",
        },
        {
          ...foundationPackages,
          matchPackageNames: ["yarn-deduplicate"],
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
          matchPackageNames: [
            "monaco-editor",
            "monaco-yaml",
            "monaco-editor-webpack-plugin",
          ],
          assignees: ["@himkp", "@dmishunov"],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Monaco Editor and related packages",
        },
        {
          matchPackageNames: ["tiptap", "tiptap-extensions"],
          matchPackagePatterns: ["@tiptap/.*", "prosemirror-.*"],
          enabled: true,
          rangeStrategy: "bump",
          assignees: ["@himkp", "@ealcantara"],
          groupName: "Content Editor Packages",
        },
        updateDOMPurify,
        updateFrontendObservability,
      ],
      semanticCommits: "disabled",
    },
    {
      repository: "gitlab-renovate-forks/gitlab",
      ...baseConfig,
      labels: ["backend", "dependency update", "type::maintenance"],
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
      dependencyDashboard: true,
      packageRules: [
        updateNothing,
        updateGitLabUIandSVG,
        ESLint,
        Stylelint,
        updateGitLabScopeDev,
        updateDOMPurify,
        {
          matchPackagePatterns: ["bootstrap-vue"],
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
        ...semanticPrefixFixDepsChoreOthers,
      ],
      semanticCommits: "enabled",
    },
    {
      repository: "gitlab-renovate-forks/customers-gitlab-com",
      ...updateOnlyGitLabScope,
      assignees: ["@vitallium", "@aalakkad"],
      semanticCommits: "disabled",
    },
    {
      repository: "gitlab-renovate-forks/gitlab-svgs",
      ...updateOnlyGitLabScope,
      semanticCommits: "disabled",
    },
    {
      repository: "gitlab-renovate-forks/design.gitlab.com",
      ...baseConfig,
      packageRules: [
        ...updateOnlyGitLabScopePackageRules,
        ...semanticPrefixFixDepsChoreOthers,
      ],
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
      assignees: ["@axil", "@eread", "@kpaizee", "@marcel.amirault"],
      assigneesSampleSize: 3,
      enabledManagers: ["npm", "bundler"],
      prConcurrentLimit: 4,
      semanticCommits: "disabled",
      packageRules: [
        {
          matchPackagePatterns: ["rollup", "bootstrap"],
          enabled: false,
        },
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
    {
      repository: "gitlab-renovate-forks/gitlab-vscode-extension",
      ...baseConfig,
      labels: [
        "dependency update",
        "type::maintenance",
        "group::code review",
        "devops::create",
      ],
      assignees: ["@viktomas"],
      packageRules: [
        {
          ...enableWithBumpStrategy,
          matchPackageNames: ["@types/jest", "jest", "ts-jest", "jest-junit"],
          groupName: "Unit testing",
        },
        {
          ...enableWithBumpStrategy,
          matchPackageNames: [
            "@types/sinon",
            "sinon",
            "mocha",
            "mocha-junit-reporter",
          ],
          groupName: "Integration testing",
        },
        {
          ...enableWithBumpStrategy,
          matchPackageNames: [
            "cross-fetch",
            "graphql-request",
            "graphql",
            "https-proxy-agent",
          ],
          groupName: "Fetch frameworks",
        },
        {
          ...enableWithBumpStrategy,
          matchPackageNames: ["request", "request-promise"],
          groupName: "Legacy fetch frameworks",
        },
        {
          ...enableWithBumpStrategy,
          matchPackageNames: [
            "eslint",
            "eslint-config-airbnb-base",
            "eslint-config-prettier",
            "eslint-plugin-import",
            "@typescript-eslint/eslint-plugin",
            "@typescript-eslint/parser",
            "prettier",
          ],
          groupName: "Linting",
        },
        {
          matchPackageNames: ["@types/node", "@types/vscode"],
          enabled: false,
        },
      ],
    },
  ],
};
