const {
  createServerConfig,
  baseConfig,
  epBaseConfig,
  availableRouletteReviewerByRole,
} = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-styles",
    ...baseConfig,
    labels: [...epBaseConfig.labels, "Engineering Productivity"],
    reviewers: availableRouletteReviewerByRole("gitlab-styles", "reviewer"),
    reviewersSampleSize: 1,
    enabledManagers: ["bundler"],
    packageRules: [
      {
        schedule: ["before 05:00 on Monday"],
        matchPackagePatterns: [".+"],
        rangeStrategy: "bump",
        matchManagers: ["bundler"],
        groupName: "Ruby dependencies",
      },
    ],
  },
]);
