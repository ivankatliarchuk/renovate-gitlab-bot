const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

const enableWithBumpStrategy = {
  rangeStrategy: "bump",
  enabled: true,
};

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-jetbrains-plugin",
    ...baseConfig,
    includePaths: ["*", "webview/*"],
    labels: [
      ...defaultLabels,
      "group::editor extensions",
      "devops::create",
      "section::dev",
      "type::maintenance",
    ],
    semanticCommits: "disabled",
    prConcurrentLimit: 5,
    reviewers: availableRouletteReviewerByRole("gitlab-jetbrains-plugin"),
    reviewersSampleSize: 1,
    enabledManagers: ["npm", "gradle"],
    packageRules: [
      {
        ...enableWithBumpStrategy,
        matchPackageNames: ["apollo3", "detekt", "kotlin"],
        groupName: "JetBrains Plugin",
      },
      {
        ...enableWithBumpStrategy,
        matchPackageNames: ["junit", "kotest", "remoterobot"],
        groupName: "Testing",
      },
      {
        ...enableWithBumpStrategy,
        matchPackageNames: [],
        groupName: "Fetch frameworks",
      },
      {
        ...enableWithBumpStrategy,
        matchPackageNames: [],
        groupName: "Linting",
      },
      {
        matchPackageNames: ["@types/node"],
        enabled: false,
      },
    ],
  },
]);
