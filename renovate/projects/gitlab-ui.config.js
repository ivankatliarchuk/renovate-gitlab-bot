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
        assignees: ["@pgascouvaillancourt"],
        rangeStrategy: "bump",
        enabled: true,
        groupName: "Bootstrap Vue",
      },
      {
        matchPackagePatterns: ["@storybook/.*"],
        assignees: ["@pgascouvaillancourt"],
        rangeStrategy: "bump",
        enabled: true,
        groupName: "Storybook",
      },
      ...semanticPrefixFixDepsChoreOthers,
    ],
    semanticCommits: "enabled",
  },
]);
