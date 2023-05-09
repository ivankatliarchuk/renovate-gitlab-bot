const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-pages",
    ...baseConfig,
    labels: [...defaultLabels],
    reviewers: availableRouletteReviewerByRole("gitlab-pages"),
    reviewersSampleSize: 1,
    enabledManagers: ["asdf", "gomod"],
    prConcurrentLimit: 4,
    semanticCommits: "disabled",
    packageRules: [],
  },
]);
