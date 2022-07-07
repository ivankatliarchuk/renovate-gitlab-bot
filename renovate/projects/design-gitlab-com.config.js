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
      {
        matchManagers: ["npm"],
        enabled: true,
        excludePackageNames: [
          "@nuxt/content",
          "@nuxtjs/sentry",
          "@vue/test-utils",
          "jest",
        ],
      },
    ],
    semanticCommits: "enabled",
  },
]);
