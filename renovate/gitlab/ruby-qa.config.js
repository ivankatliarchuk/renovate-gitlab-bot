const {
  createServerConfig,
  baseConfig,
  qaBaseConfig,
  GITLAB_REPO,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: GITLAB_REPO,
    dependencyDashboardTitle: "Dependency Dashboard (ruby-qa)",
    ...baseConfig,
    ...qaBaseConfig,
    rangeStrategy: "bump",
    branchPrefix: "renovate-qa-gems/",
    enabledManagers: ["bundler"],
    postUpdateOptions: ["bundlerConservative"],
    includePaths: ["qa/*"],
    packageRules: [
      {
        enabled: true,
      },
      {
        // activesupport needs to be in sync with gitlab
        // fog-core is not currently upgradeable due to compatibility issues
        matchPackageNames: ["activesupport", "fog-core", "fog-google"],
        enabled: false,
      },
    ],
  },
]);
