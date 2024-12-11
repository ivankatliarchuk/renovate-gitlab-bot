const {
  createServerConfig,
  baseConfig,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/contributor-success-toolbox",
    ...baseConfig,
    includePaths: ['*', 'bin/*'],
    labels: ["Contributor Success"],
    reviewers: ["stingrayza", "leetickett-gitlab"],
    enabledManagers: ["bundler"],
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
