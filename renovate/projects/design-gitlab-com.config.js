const {
  createServerConfig,
  baseConfig,
  semanticPrefixFixDepsChoreOthers,
  updateGitLabUIandSVG,
  ESLint,
  Stylelint,
  updateGitLabScopeDev,
  noMajor,
  updateNothing,
} = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/design.gitlab.com",
    ...baseConfig,
    reviewers: [
      "leipert",
      "markrian",
      "mikegreiling",
      "ohoral",
      "pgascouvaillancourt",
    ],
    internalChecksFilter: "strict",
    stabilityDays: 3,
    packageRules: [
      updateNothing,
      ...semanticPrefixFixDepsChoreOthers,
      {
        ...updateGitLabUIandSVG,
        schedule: ["before 05:00 on Monday"],
      },
      ESLint,
      Stylelint,
      updateGitLabScopeDev,
      {
        matchPackageNames: ["vue", "vue-template-compiler"],
        allowedVersions: "<3",
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Vue",
      },
    ],
    semanticCommits: "enabled",
  },
]);
