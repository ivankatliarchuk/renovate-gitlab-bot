const { 
  createServerConfig,
  baseConfig,
  defaultLabels,
} = require("../shared");

module.exports = createServerConfig([
    {
      repository: "gitlab-renovate-forks/package-hunter-cli",
      ...baseConfig,
      semanticCommits: "enabled",
      reviewers: ["estrike", "dappelt"],
      reviewersSampleSize: 1,
      labels: [
        ...defaultLabels, 
        "Security Research::Package Hunter",
      ],
    },
]);

