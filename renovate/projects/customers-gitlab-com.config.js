const {
  createServerConfig,
  baseConfig,
  updateNothing,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { prGitLabScopeAndLinters } = require("../lib/npm");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/customers-gitlab-com",
    ...baseConfig,
    labels: [...defaultLabels, "section::fulfillment", "devops::fulfillment"],
    reviewers: availableRouletteReviewerByRole("customers-app", [
      "maintainer frontend",
    ]),
    reviewersSampleSize: 1,
    semanticCommits: "disabled",
    enabledManagers: ["npm"],
    packageRules: [updateNothing, ...prGitLabScopeAndLinters],
  },
]);
