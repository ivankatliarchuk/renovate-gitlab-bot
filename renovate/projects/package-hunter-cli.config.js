const {
  createServerConfig,
  defaultLabels,
  baseConfig,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/package-hunter-cli",
    ...baseConfig,
    semanticCommits: "enabled",
    reviewers: ["estrike", "dappelt"],
    reviewersSampleSize: 1,
    enabledManagers: ["npm"],
    labels: [...defaultLabels, "Security Research::Package Hunter"],
  },
]);
