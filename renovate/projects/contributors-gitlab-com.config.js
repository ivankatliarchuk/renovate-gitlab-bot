const {
  createServerConfig,
  baseConfig,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/contributors-gitlab-com",
    ...baseConfig,
    includePaths: ['contributors/*'],
    labels: ["Contributor Success"],
    reviewers: ["stingrayza", "leetickett-gitlab"],
    enabledManagers: ["bundler", "npm", "docker-compose", "dockerfile"],
    semanticCommits: "disabled",
    packageRules: [
      {
        enabled: true,
        matchPackagePatterns: [".+"],
        rangeStrategy: "bump",
        matchManagers: ["bundler"],
        groupName: "Ruby production dependencies",
      },
      {
        enabled: true,
        matchDepTypes: ["test", "development"],
        rangeStrategy: "bump",
        matchManagers: ["bundler"],
        groupName: "Ruby development dependencies",
      },
    ],
  },
]);
