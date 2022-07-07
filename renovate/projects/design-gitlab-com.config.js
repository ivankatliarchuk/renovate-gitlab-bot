const {
  createServerConfig,
  baseConfig,
  semanticPrefixFixDepsChoreOthers,
  updateGitLabUIandSVG,
  ESLint,
  Stylelint,
  updateGitLabScopeDev,
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
      {
        matchPackageNames: [
          "vue",
          "vue-template-compiler",
          "vue-server-renderer",
        ],
        allowedVersions: "<3",
        enabled: true,
        groupName: "Vue",
      },
      {
        matchPackagePatterns: ["@babel.+"],
        enabled: true,
        groupName: "Babel",
      },
      {
        matchPackageNames: ["jest", "jest-environment-jsdom"],
        enabled: true,
        groupName: "Jest",
      },
    ],
  },
]);
