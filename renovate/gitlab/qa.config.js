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
    customManagers: [
      {
        customType: "regex",
        fileMatch: ["qa/gdk/Dockerfile.gdk"],
        matchStrings: ["GDK_SHA=(?<currentDigest>.*?)\\n"],
        currentValueTemplate: "main",
        depNameTemplate: "gitlab-development-kit",
        packageNameTemplate: "https://gitlab.com/gitlab-org/gitlab-development-kit.git",
        datasourceTemplate: "git-refs"
      }
    ],
    packageRules: [
      {
        enabled: true,
      },
      {
        description: "GDK version update",
        groupName: "gdk-qa",
        matchFiles: ["qa/gdk/Dockerfile.gdk"]
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
