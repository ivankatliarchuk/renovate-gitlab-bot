const {
  createServerConfig,
  baseConfig,
  availableRouletteReviewerByRole,
  updateNothing,
  foundationLabels,
} = require("../lib/shared");
const { updateNodeJS } = require("../lib/languages");
const { prGitLabScopeAndLinters } = require("../lib/npm");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-svgs",
    ...baseConfig,
    labels: foundationLabels,
    reviewers: availableRouletteReviewerByRole(
      "gitlab-svgs",
      "maintainer frontend"
    ),
    enabledManagers: ["npm", "asdf", "custom.regex"],
    rangeStrategy: "auto",
    packageRules: [
      updateNothing,
      ...prGitLabScopeAndLinters,
      {
        ...updateNodeJS.packageRules[0],
        minimumReleaseAge: "3 weeks",
      },
    ],
    customManagers: [...updateNodeJS.customManagers()],
    semanticCommits: "disabled",
  },
]);
