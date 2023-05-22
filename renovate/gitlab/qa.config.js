const {
  createServerConfig,
  baseConfig,
  qaBaseConfig,
  GITLAB_REPO,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: GITLAB_REPO,
    dependencyDashboardTitle: "Dependency Dashboard (qa)",
    ...baseConfig,
    ...qaBaseConfig,
    rangeStrategy: "bump",
    branchPrefix: "renovate-qa/",
    enabledManagers: ["bundler", "gitlabci-include"],
    postUpdateOptions: ["bundlerConservative"],
    includePaths: ["qa/*", ".gitlab/ci/qa-common/*"],
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
