const {
  createServerConfig,
  baseConfig,
  defaultLabels,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-shell",
    ...baseConfig,
    labels: [...defaultLabels],
    reviewers: ["ashmckenzie"],
    reviewersSampleSize: 1,
    enabledManagers: ["asdf", "bundler", "gomod"],
    prConcurrentLimit: 4,
    semanticCommits: "disabled",
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
