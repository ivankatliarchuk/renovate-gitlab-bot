const {
  createServerConfig,
  baseConfig,
  updateOnlyGitLabScope,
  availableRouletteReviewerByRole,
} = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/status-page",
    ...baseConfig,
    ...updateOnlyGitLabScope,
    reviewers: availableRouletteReviewerByRole(
      "status-page",
      "maintainer frontend"
    ),
    reviewersSampleSize: 1,
    semanticCommits: "disabled",
  },
]);
