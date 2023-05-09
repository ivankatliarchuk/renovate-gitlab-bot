const {
  createServerConfig,
  baseConfig,
  semanticPrefixFixDepsChoreOthers,
  updateGitLabUIandSVG,
  ESLint,
  Stylelint,
  updateGitLabScopeDev,
  availableRouletteReviewerByRole,
} = require("../shared");
const { prVueMajor2, prBabel, prJest } = require("../frontend");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/design.gitlab.com",
    ...baseConfig,
    reviewers: availableRouletteReviewerByRole(
      "design.gitlab.com",
      "maintainer frontend"
    ),
    internalChecksFilter: "strict",
    separateMultipleMajor: true,
    stabilityDays: 3,
    rangeStrategy: "bump",
    semanticCommits: "enabled",
    packageRules: [
      ...semanticPrefixFixDepsChoreOthers,
      {
        ...updateGitLabUIandSVG,
        schedule: ["before 05:00 on Monday"],
      },
      ESLint,
      Stylelint,
      updateGitLabScopeDev,
      prVueMajor2,
      prBabel,
      prJest,
    ],
  },
]);
