const { createServerConfig, baseConfig } = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-docs",
    ...baseConfig,
    labels: [
      "Technical Writing",
      "Category:Docs Site",
      "type::maintenance",
      "automation:bot-authored",
    ],
    assignees: [
      "@axil",
      "@eread",
      "@kpaizee",
      "@marcel.amirault",
      "@sarahgerman",
    ],
    assigneesSampleSize: 3,
    enabledManagers: ["npm", "bundler"],
    prConcurrentLimit: 4,
    semanticCommits: "disabled",
    packageRules: [
      {
        matchPackagePatterns: ["bootstrap", "vue"],
        enabled: false,
      },
      {
        schedule: ["before 05:00 on Monday"],
        matchPackagePatterns: [".+"],
        rangeStrategy: "bump",
        matchManagers: ["bundler"],
        groupName: "Ruby dependencies",
      },
      {
        schedule: ["before 05:00 on Monday"],
        matchPackagePatterns: [".+"],
        rangeStrategy: "bump",
        matchManagers: ["npm"],
        groupName: "NodeJS dependencies",
      },
    ],
  },
]);
