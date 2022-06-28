const { createServerConfig, baseConfig } = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-development-kit",
    ...baseConfig,
    assignees: ["@ashmckenzie", "@tigerwnz", "@toon"],
    enabledManagers: ["npm", "bundler"],
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
