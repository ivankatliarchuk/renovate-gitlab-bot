const {
  createServerConfig,
  baseConfig,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/contributors-gitlab-com",
    ...baseConfig,
    branchPrefix: "renovate-gems/",
    labels: [
      "Contributor Success"
    ],
    reviewers: ["stingrayza", "leetickett-gitlab"],
    enabledManagers: ["bundler"],
    postUpdateOptions: ["bundlerConservative"],
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
