const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/rspec_profiling_stats",
    ...baseConfig,
    labels: [
      ...defaultLabels,
    ],
    reviewers: availableRouletteReviewerByRole("gitlab-rspec-profiling-stats", "reviewer"),
    enabledManagers: ["custom.regex"],
    semanticCommits: "disabled",
    ...updateDangerReviewComponent,
  },
]);
