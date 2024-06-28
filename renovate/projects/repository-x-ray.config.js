const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/repository-x-ray",
    ...baseConfig,
    labels: [
      ...defaultLabels,
    ],
    reviewers: availableRouletteReviewerByRole("repository-x-ray", "reviewer"),
    enabledManagers: ["custom.regex"],
    semanticCommits: "disabled",
    ...updateDangerReviewComponent,
  },
]);
