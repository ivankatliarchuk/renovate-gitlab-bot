const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-zoekt-indexer",
    ...baseConfig,
    labels: [...defaultLabels, "group::global search"],
    reviewers: availableRouletteReviewerByRole("gitlab-zoekt-indexer", "maintainer"),
    reviewersSampleSize: 1,
    enabledManagers: ["asdf", "gomod"],
    prConcurrentLimit: 4,
    semanticCommits: "disabled",
    packageRules: [],
    postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
  },
]);
