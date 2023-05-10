const {
  createServerConfig,
  updateNothing,
  baseConfig,
  semanticPrefixFixDepsChoreOthers,
  availableRouletteReviewerByRole,
  defaultLabels,
} = require("../lib/shared");
const {
  prJest,
  prBabel,
  prVueMajor2,
  updateDOMPurify,
  prGitLabScopeAndLinters,
} = require("../lib/npm");
const { updateNodeJS } = require("../lib/languages");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-ui",
    ...baseConfig,
    reviewers: availableRouletteReviewerByRole(
      "gitlab-ui",
      "maintainer frontend"
    ),
    labels: [...defaultLabels, "frontend"],
    internalChecksFilter: "strict",
    separateMultipleMajor: true,
    stabilityDays: 3,
    rangeStrategy: "auto",
    semanticCommits: "enabled",
    enabledManagers: ["npm", "asdf", "regex", "nvm"],
    packageRules: [
      ...semanticPrefixFixDepsChoreOthers,
      updateNothing,
      ...prGitLabScopeAndLinters,
      {
        ...updateDOMPurify,
        rangeStrategy: "update-lockfile",
      },
      {
        matchPackagePatterns: ["bootstrap-vue"],
        separateMultipleMajor: true,
        reviewers: ["pgascouvaillancourt"],
        enabled: true,
        groupName: "Bootstrap Vue",
      },
      {
        matchPackagePatterns: ["@storybook/.*"],
        reviewers: ["pgascouvaillancourt"],
        enabled: true,
        groupName: "Storybook",
      },
      {
        matchPackageNames: ["cypress"],
        enabled: true,
      },
      prJest,
      prBabel,
      prVueMajor2,
      ...updateNodeJS.packageRules,
    ],
    regexManagers: [
      ...updateNodeJS.regexManagers([
        "^.gitlab-ci.yml",
        "^Dockerfile.puppeteer",
      ]),
    ],
  },
]);
