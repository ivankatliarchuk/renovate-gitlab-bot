const {
  createServerConfig,
  baseConfig,
  epBaseConfig,
  GITLAB_REPO,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: GITLAB_REPO,
    dependencyDashboardTitle: "Dependency Dashboard (EP)",
    ...baseConfig,
    ...epBaseConfig,
    rangeStrategy: "bump",
    branchPrefix: "renovate-ep/",
    enabledManagers: ["gitlabci-include"],
    includePaths: [".gitlab/ci/**/*"],
    ignorePaths: [".gitlab/ci/qa-common/*"],
    packageRules: [
      {
        enabled: true,
      },
    ],
  },
]);
