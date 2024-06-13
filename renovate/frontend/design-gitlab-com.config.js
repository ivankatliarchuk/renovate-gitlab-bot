const {
  createServerConfig,
  baseConfig,
  semanticPrefixFixDepsChoreOthers,
  availableRouletteReviewerByRole,
  foundationLabels,
} = require("../lib/shared");
const {
  prVueMajor2,
  prBabel,
  prJest,
  prGitLabUISVG,
  prGitLabScopeAndLinters,
} = require("../lib/npm");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/design.gitlab.com",
    ...baseConfig,
    labels: foundationLabels,
    reviewers: availableRouletteReviewerByRole(
      "design.gitlab.com",
      "maintainer frontend"
    ),
    internalChecksFilter: "strict",
    separateMultipleMajor: true,
    minimumReleaseAge: "3 days",
    rangeStrategy: "auto",
    semanticCommits: "enabled",
    enabledManagers: ["npm", "custom.regex"],
    ...updateDangerReviewComponent,
    packageRules: [
      ...semanticPrefixFixDepsChoreOthers,
      ...prGitLabScopeAndLinters,
      {
        ...prGitLabUISVG,
        schedule: ["before 05:00 on Monday"],
      },
      prVueMajor2,
      prBabel,
      prJest,
    ],
  },
]);
