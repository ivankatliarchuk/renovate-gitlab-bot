const { createServerConfig, baseConfig, defaultLabels } = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-pages",
    ...baseConfig,
    labels: [
      ...defaultLabels,
    ],
    reviewers: [
      "grzesiek",
      "jaime",
      "nolith",
      "vshushlin",
    ],
    reviewersSampleSize: 1,
    enabledManagers: ["asdf", "gomod"],
    prConcurrentLimit: 4,
    semanticCommits: "disabled",
    packageRules: [ ],
  },
]);
