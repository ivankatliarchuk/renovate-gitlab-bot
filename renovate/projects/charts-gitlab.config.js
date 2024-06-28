const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/charts-gitlab",
    ...baseConfig,
    labels: [
      ...defaultLabels,
    ],
    reviewers: availableRouletteReviewerByRole("gitlab-chart", "reviewer"),
    enabledManagers: ["custom.regex"],
    semanticCommits: "disabled",
    ...updateDangerReviewComponent,
  },
]);
