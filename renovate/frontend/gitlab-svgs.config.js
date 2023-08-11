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
    enabledManagers: ["npm", "asdf", "regex"],
    rangeStrategy: "auto",
    packageRules: [
      updateNothing,
      ...prGitLabScopeAndLinters,
      ...updateNodeJS.packageRules,
    ],
    regexManagers: [...updateNodeJS.regexManagers()],
    semanticCommits: "disabled",
    packageRules: [
      {
        matchPackageNames: ["node"],
        minimumReleaseAge: "3 weeks"
      }
    ]
  },
]);
