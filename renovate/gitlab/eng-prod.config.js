const {
  createServerConfig,
  baseConfig,
  epBaseConfig,
  GITLAB_REPO,
} = require("../lib/shared");
const { updateDangerReviewComponent  } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: GITLAB_REPO,
    dependencyDashboardTitle: "Dependency Dashboard (EP)",
    ...baseConfig,
    ...epBaseConfig,
    rangeStrategy: "bump",
    branchPrefix: "renovate-ep/",
    enabledManagers: ["gitlabci-include", "custom.regex"],
    includePaths: [".gitlab/ci/**/*"],
    ignorePaths: [".gitlab/ci/qa-common/*"],
    ...updateDangerReviewComponent,
    packageRules: [
      {
        enabled: true,
      },
    ],
  },
]);
