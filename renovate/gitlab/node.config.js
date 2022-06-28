const {
  createServerConfig,
  updateNothing,
  updateGitLabUIandSVG,
  ESLint,
  Stylelint,
  updateGitLabScopeDev,
  baseConfig,
  updateDOMPurify,
  updateGitLabScope,
} = require("../shared");

const foundationPackages = {
  assignees: ["@leipert", "@mikegreiling"],
  addLabels: ["group::foundations", "automation:bot-authored"],
};

const updateGitLabVisualReviewTools = {
  ...updateGitLabScope,
  matchPackageNames: ["@gitlab/visual-review-tools"],
  groupName: "GitLab Visual Review Tools",
};

const updateFrontendObservability = {
  matchPackagePatterns: ["@sentry/browser"],
  rangeStrategy: "bump",
  enabled: true,
  assignees: ["@jivanvl"],
  groupName: "Frontend Observability Packages",
};

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab",
    ...baseConfig,
    dependencyDashboardTitle: "Dependency Dashboard (node)",
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
]);
