const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/glql-rust",
    ...baseConfig,
    labels: [...defaultLabels, "group::knowledge"],
    reviewers: availableRouletteReviewerByRole(
      "glql-rust",
      "maintainer"
    ),
    reviewersSampleSize: 1,
    enabledManagers: ["asdf", "cargo", "custom.regex"],
    ...updateDangerReviewComponent,
    prConcurrentLimit: 4,
    semanticCommits: "enabled",
    packageRules: [],
  },
]);
