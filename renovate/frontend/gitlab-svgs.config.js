const {
  createServerConfig,
  baseConfig,
  availableRouletteReviewerByRole,
  updateNothing,
  designSystemLabels,
} = require("../lib/shared");
const { updateNodeJS } = require("../lib/languages");
const { prGitLabScopeAndLinters } = require("../lib/npm");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-svgs",
    ...baseConfig,
    labels: designSystemLabels,
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
    customManagers: [
      ...updateNodeJS.customManagers(),
      ...updateDangerReviewComponent.customManagers,
    ],
    semanticCommits: "disabled",
  },
]);
