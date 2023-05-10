const {
  createServerConfig,
  availableRouletteReviewerByRole,
  baseConfig,
  updateNothing,
  defaultLabels,
} = require("../lib/shared");
const { prGitLabScopeAndLinters } = require("../lib/npm");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/status-page",
    ...baseConfig,
    labels: [...defaultLabels, "frontend"],
    reviewers: availableRouletteReviewerByRole(
      "status-page",
      "maintainer frontend"
    ),
    reviewersSampleSize: 1,
    semanticCommits: "disabled",
    rangeStrategy: "auto",
    enabledManagers: ["npm"],
    packageRules: [updateNothing, ...prGitLabScopeAndLinters],
  },
]);
