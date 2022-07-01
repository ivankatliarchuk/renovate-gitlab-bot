const {
  createServerConfig,
  updateNothing,
  updateGitLabUIandSVG,
  ESLint,
  Stylelint,
  updateGitLabScopeDev,
  baseConfig,
  updateDOMPurify,
  semanticPrefixFixDepsChoreOthers,
} = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-ui",
    ...baseConfig,
    packageRules: [
      updateNothing,
      updateGitLabUIandSVG,
      ESLint,
      Stylelint,
      updateGitLabScopeDev,
      updateDOMPurify,
      {
        matchPackagePatterns: ["bootstrap-vue"],
        separateMultipleMajor: true,
        reviewers: ["pgascouvaillancourt"],
        reviewersSampleSize: 1,
        rangeStrategy: "bump",
        enabled: true,
        groupName: "Bootstrap Vue",
      },
      {
        matchPackagePatterns: ["@storybook/.*"],
        reviewers: ["pgascouvaillancourt"],
        reviewersSampleSize: 1,
        rangeStrategy: "bump",
        enabled: true,
        groupName: "Storybook",
      },
      ...semanticPrefixFixDepsChoreOthers,
    ],
    semanticCommits: "enabled",
  },
]);
