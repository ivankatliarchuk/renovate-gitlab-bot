const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-runner",
    ...baseConfig,
    labels: [
      ...defaultLabels,
    ],
    reviewers: availableRouletteReviewerByRole("gitlab-runner"),
    enabledManagers: ["custom.regex"],
    semanticCommits: "disabled",
    ...updateDangerReviewComponent,
  },
]);
