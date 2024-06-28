const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/snowplow-micro-configuration",
    ...baseConfig,
    labels: [
      ...defaultLabels,
    ],
    reviewers: availableRouletteReviewerByRole("snowplow-micro-configuration"),
    enabledManagers: ["custom.regex"],
    semanticCommits: "disabled",
    ...updateDangerReviewComponent,
  },
]);
