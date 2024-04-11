const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-elasticsearch-indexer",
    ...baseConfig,
    labels: [...defaultLabels, "group::global search"],
    reviewers: availableRouletteReviewerByRole(
      "gitlab-elasticsearch-indexer",
      "maintainer"
    ),
    reviewersSampleSize: 1,
    enabledManagers: ["asdf", "gomod"],
    prConcurrentLimit: 4,
    semanticCommits: "enabled",
    packageRules: [],
    postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
  },
]);
