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
    separateMultipleMajor: true,
    stabilityDays: 3,
    packageRules: [
      ...semanticPrefixFixDepsChoreOthers,
      {
        ...updateGitLabUIandSVG,
        schedule: ["before 05:00 on Monday"],
      },
      ESLint,
      Stylelint,
      updateGitLabScopeDev,
      {
        matchPackageNames: [
          "vue",
          "vue-template-compiler",
          "vue-server-renderer",
        ],
        allowedVersions: "<3",
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Vue",
      },
      {
        matchPackagePatterns: ["@babel.+"],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Babel",
      },
    ],
    semanticCommits: "enabled",
  },
]);
