const {
  createServerConfig,
  baseConfig,
  qaBaseConfig,
  enableWithBumpStrategy
} = require("../shared");

module.exports = createServerConfig(
  [
    {
      repository: "gitlab-renovate-forks/gitlab",
      dependencyDashboardTitle: "Dependency Dashboard (ruby-qa)",
      ...baseConfig,
      ...qaBaseConfig,
      branchPrefix: "renovate-qa-gems/",
      enabledManagers: ["bundler"],
      postUpdateOptions: ["bundlerConservative"],
      includePaths: ["qa/*"],
      packageRules: [
        enableWithBumpStrategy,
        {
          // activesupport needs to be in sync with gitlab
          // fog-core is not currently upgradeable due to compatibility issues
          matchPackageNames: ["activesupport", "fog-core", "fog-google"],
          enabled: false
        }
      ],
    },
  ],
);
