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
    enabledManagers: ["bundler", "gitlabci-include", "dockerfile", "regex"],
    postUpdateOptions: ["bundlerConservative"],
    includePaths: ["qa/*", "qa/gdk/*", ".gitlab/ci/qa-common/*"],
    regexManagers: [
      {
        fileMatch: ["scripts/build_gdk_image"],
        matchStrings: ["ARG GDK_SHA=(?<currentDigest>.*?)\\n"],
        currentValueTemplate: "main",
        depNameTemplate: "gdk",
        packageNameTemplate: "https://gitlab.com/gitlab-org/gitlab-development-kit",
        dataSourceTemplate: "git-refs"
      }
    ],
    packageRules: [
      {
        enabled: true,
      },
      {
        description: "GDK version update",
        groupName: "gdk-qa",
        matchFiles: ["Dockerfile.gdk"]
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
