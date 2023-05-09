const {
  createServerConfig,
  baseConfig,
  updateOnlyGitLabScopePackageRules,
  availableRouletteReviewerByRole,
} = require("../shared");
const { updateNodeJS } = require("../frontend");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-svgs",
    ...baseConfig,
    reviewers: availableRouletteReviewerByRole(
      "gitlab-svgs",
      "maintainer frontend"
    ),
    enabledManagers: ["npm", "asdf", "regex"],
    packageRules: [
      ...updateOnlyGitLabScopePackageRules,
      ...updateNodeJS.packageRules,
    ],
    regexManagers: [...updateNodeJS.regexManagers()],
    semanticCommits: "disabled",
  },
]);
