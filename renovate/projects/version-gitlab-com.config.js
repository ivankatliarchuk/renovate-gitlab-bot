const {
  createServerConfig,
  availableRouletteReviewerByRole,
  baseConfig,
  defaultLabels,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/version.gitlab.com",
    ...baseConfig,
    labels: [
      ...defaultLabels,
      "devops::monitor",
      "section::analytics",
      "group::analytics instrumentation",
    ],
    reviewers: availableRouletteReviewerByRole(
      "version.gitlab.com",
      "maintainer backend"
    ),
    reviewersSampleSize: 1,
    semanticCommits: "disabled",
    rangeStrategy: "auto",
    separateMultipleMajor: true,
    minimumReleaseAge: "3 days",
    enabledManagers: ["bundler"],
    packageRules: [
      {
        matchPackagePatterns: [".+"],
        matchManagers: ["bundler"],
        extends: ["schedule:weekly"],
      },
    ],
  },
]);
