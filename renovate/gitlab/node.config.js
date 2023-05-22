const {
  createServerConfig,
  updateNothing,
  baseConfig,
  availableRouletteReviewerByRole,
  foundationLabels,
  defaultLabels,
  GITLAB_REPO,
} = require("../lib/shared");
const {
  prVueMajor2,
  updateDOMPurify,
  prGitLabScopeAndLinters,
} = require("../lib/npm");

const foundationPackages = {
  reviewers: ["leipert"],
  addLabels: [...foundationLabels],
};

module.exports = createServerConfig([
  {
    repository: GITLAB_REPO,
    ...baseConfig,
    reviewers: availableRouletteReviewerByRole("gitlab", "maintainer frontend"),
    labels: [...defaultLabels, "frontend"],
    dependencyDashboardTitle: "Dependency Dashboard (node)",
    rangeStrategy: "auto",
    enabledManagers: ["npm"],
    packageRules: [
      updateNothing,
      ...prGitLabScopeAndLinters,
      updateDOMPurify,
      {
        enabled: true,
        matchPackageNames: ["@gitlab/visual-review-tools"],
        groupName: "GitLab Visual Review Tools",
      },
      {
        enabled: true,
        matchPackageNames: ["@gitlab/web-ide"],
        reviewers: ["ealcantara", "pslaughter"],
        groupName: "GitLab Web IDE",
      },
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
      },
      {
        ...foundationPackages,
        matchPackageNames: ["webpack", "webpack-cli", "webpack-dev-server"],
        enabled: true,
        groupName: "Webpack core packages",
      },
      {
        ...foundationPackages,
        matchPackageNames: ["core-js"],
        enabled: true,
      },
      {
        ...foundationPackages,
        matchPackageNames: ["commander"],
        enabled: true,
      },
      {
        ...foundationPackages,
        matchPackageNames: ["yarn-deduplicate"],
        enabled: true,
      },
      {
        ...prVueMajor2,
        reviewers: ["@leipert"],
      },
      {
        reviewers: ["samdbeckham"],
        matchPackageNames: ["vue-virtual-scroll-list"],
        enabled: true,
      },
      {
        reviewers: ["pslaughter"],
        matchPackagePatterns: ["^@sourcegraph/*"],
        enabled: true,
        groupName: "Sourcegraph",
      },
      {
        reviewers: ["himkp", "ealcantara"],
        matchPackagePatterns: ["@tiptap/.*"],
        enabled: true,
        groupName: "Content Editor Packages — tiptap",
      },
      {
        reviewers: ["himkp", "ealcantara"],
        matchPackagePatterns: ["prosemirror-.*"],
        enabled: true,
        groupName: "Content Editor Packages - prosemirror",
      },
      {
        reviewers: ["himkp", "ealcantara"],
        matchPackagePatterns: [
          "remark-?.*",
          "rehype-?.*",
          "unist-?.*",
          "unified",
        ],
        enabled: true,
        groupName: "Content Editor Packages - remark",
      },
      {
        reviewers: ["rob.hunt", "jiaan", "elwyn-gitlab"],
        matchPackagePatterns: ["@cubejs-client/.*"],
        enabled: true,
        groupName: "Analytics dashboards - cubejs",
        addLabels: [
          "group::product analytics",
          "devops::analytics",
          "section::analytics",
          "frontend",
        ],
      },
      {
        reviewers: ["rob.hunt", "jiaan", "elwyn-gitlab"],
        matchPackagePatterns: ["gridstack"],
        enabled: true,
        groupName: "Customizable dashboards packages",
        addLabels: [
          "group::product analytics",
          "devops::analytics",
          "section::analytics",
          "frontend",
        ],
      },
      {
        enabled: true,
        matchPackagePatterns: ["@sentry/browser"],
        reviewers: ["jivanvl"],
        groupName: "Frontend Observability Packages",
      },
    ],
    semanticCommits: "disabled",
  },
]);
