const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/ai-assist",
    ...baseConfig,
    labels: [...defaultLabels],
    reviewers: availableRouletteReviewerByRole("ai-gateway", "reviewer"),
    enabledManagers: ["custom.regex"],
    semanticCommits: "enabled",
    semanticCommitType: "chore(deps)",
    ...updateDangerReviewComponent,
  },
]);
