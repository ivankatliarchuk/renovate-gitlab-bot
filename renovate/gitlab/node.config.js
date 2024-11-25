const {
  createServerConfig,
  updateNothing,
  baseConfig,
  availableRouletteReviewerByRole,
  defaultLabels,
  GITLAB_REPO,
} = require("../lib/shared");
const {
  prVueMajor2,
  updateDOMPurify,
  prGitLabUI,
  prGitLabSVG,
  prGitLabCatchall,
  prEslint,
  prStylelint,
} = require("../lib/npm");

const eipiPackages = {
  reviewers: ["leipert"],
  addLabels: [
    "group::personal productivity",
    "devops::foundations",
    "section::core platform",
  ],
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
      prGitLabCatchall,
      prEslint,
      prStylelint,
      prGitLabUI,
      prGitLabSVG,
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
        enabled: true,
        reviewers: ["himkp"],
        matchPackageNames: ["@gitlab/query-language", "@gitlab/query-language-rust"],
        groupName: "GitLab Query Language",
      },
      {
        ...eipiPackages,
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
        ...eipiPackages,
        matchPackageNames: ["webpack", "webpack-cli", "webpack-dev-server"],
        enabled: true,
        groupName: "Webpack core packages",
      },
      {
        ...eipiPackages,
        matchPackageNames: ["core-js"],
        enabled: true,
      },
      {
        ...eipiPackages,
        matchPackageNames: ["commander"],
        enabled: true,
      },
      {
        ...eipiPackages,
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
        reviewers: ["rob.hunt", "jiaan"],
        matchPackagePatterns: ["@cubejs-client/.*"],
        enabled: true,
        groupName: "Analytics dashboards - cubejs",
        addLabels: ["group::product analytics", "frontend"],
      },
      {
        reviewers: ["rob.hunt", "jiaan"],
        matchPackagePatterns: ["gridstack"],
        enabled: true,
        groupName: "Customizable dashboards packages",
        addLabels: ["group::product analytics", "frontend"],
      },
      {
        enabled: true,
        matchPackageNames: ["@sentry/browser", "sentrybrowser"],
        reviewers: ["mrincon", "sheldonled"],
        groupName: "Frontend Observability Packages",
        schedule: ["before 05:00 on Monday"],
      },
      {
        reviewers: ["slashmanov", "leipert"],
        matchPackageNames: [
          "@rollup/plugin-graphql",
          "@vitejs/plugin-vue2",
          "@originjs/vite-plugin-commonjs",
          "vite",
          "vite-plugin-ruby",
        ],
        enabled: true,
        groupName: "Vite and related",
        addLabels: ["frontend"],
      },
    ],
    semanticCommits: "disabled",
  },
]);
