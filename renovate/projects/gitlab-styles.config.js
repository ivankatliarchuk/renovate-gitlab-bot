const { createServerConfig, baseConfig, epBaseConfig } = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-styles",
    ...baseConfig,
    labels: [
      ...epBaseConfig.labels,
      "Engineering Productivity",
    ],
    reviewers: [
      // Reviewers as per https://about.gitlab.com/handbook/engineering/projects/#gitlab-styles
      "alberts-gitlab",
      "ali-gitlab",
      "alinamihaila",
      "ashmckenzie",
      "eugielimpin",
      "jennli",
      "kassio",
      "morefice",
      "nao.hashizume",
      "sashi_kumar",
    ],
    reviewersSampleSize: 1,
    enabledManagers: ["bundler"],
    packageRules: [
      {
        schedule: ["before 05:00 on Monday"],
        matchPackagePatterns: [".+"],
        rangeStrategy: "bump",
        matchManagers: ["bundler"],
        groupName: "Ruby dependencies",
      },
    ],
  },
]);
