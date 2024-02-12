const {
  createServerConfig,
  updateNothing,
  baseConfig,
  defaultLabels,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-docs",
    ...baseConfig,
    labels: [...defaultLabels, "Technical Writing", "Category:Docs Site"],
    reviewers: ["sarahgerman"],
    reviewersSampleSize: 1,
    enabledManagers: ["bundler"],
    prConcurrentLimit: 4,
    semanticCommits: "disabled",
    packageRules: [
      {
        schedule: ["on the first day of the month"],
        matchPackagePatterns: [".+"],
        rangeStrategy: "bump",
        matchManagers: ["bundler"],
        groupName: "Ruby dependencies",
      },
    ],
  },
]);
