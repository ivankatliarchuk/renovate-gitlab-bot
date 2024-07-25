const {
  createServerConfig,
  baseConfig,
  distributionLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/charts-gitlab",
    ...baseConfig,
    labels: distributionLabels,
    reviewers: availableRouletteReviewerByRole("gitlab-chart", [
      "reviewer",
      "trainee_maintainer",
    ]),
    enabledManagers: ["custom.regex"],
    semanticCommits: "disabled",
    ...updateDangerReviewComponent,
  },
]);
