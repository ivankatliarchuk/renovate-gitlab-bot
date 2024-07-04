const {
  createServerConfig,
  baseConfig,
  qaBaseConfig,
  GITLAB_REPO,
} = require("../lib/shared");

module.exports = createServerConfig(
  [
    {
      repository: GITLAB_REPO,
      dependencyDashboardTitle: "Dependency Dashboard (qa)",
      ...baseConfig,
      ...qaBaseConfig,
      rangeStrategy: "bump",
      branchPrefix: "renovate-qa/",
      enabledManagers: ["bundler", "gitlabci-include", "custom.regex"],
      postUpdateOptions: ["bundlerConservative"],
      includePaths: [
        "qa/*",
        "qa/gdk/*",
        "qa/gems/gitlab-cng/*",
        ".gitlab/ci/qa-common/*",
      ],
      customManagers: [
        {
          customType: "regex",
          fileMatch: ["qa/gdk/Dockerfile.gdk"],
          matchStrings: ["GDK_SHA=(?<currentDigest>.*?)\\n"],
          currentValueTemplate: "main",
          depNameTemplate: "gitlab-development-kit",
          packageNameTemplate:
            "https://gitlab.com/gitlab-org/gitlab-development-kit.git",
          datasourceTemplate: "git-refs",
        },
        {
          customType: "regex",
          fileMatch: [".gitlab/ci/qa-common/main.gitlab-ci.yml"],
          matchStrings: ['allure-report@(?<currentValue>.*?)"\\n'],
          depNameTemplate: "allure-report-publisher",
          packageNameTemplate:
            "https://gitlab.com/gitlab-org/quality/pipeline-common.git",
          datasourceTemplate: "git-tags",
        },
        {
          customType: "regex",
          fileMatch: [".gitlab/ci/qa-common/variables.gitlab-ci.yml"],
          matchStrings: ['GITLAB_HELM_CHART_REF: "(?<currentDigest>.*?)"'],
          currentValueTemplate: "master",
          depNameTemplate: "gitlab",
          packageNameTemplate:
            "https://gitlab.com/gitlab-org/charts/gitlab.git",
          datasourceTemplate: "git-refs",
        },
      ],
      packageRules: [
        {
          enabled: true,
        },
        {
          description: "QA CI component updates",
          groupName: "ci-qa",
          matchFileNames: [".gitlab/ci/qa-common/*"],
        },
        {
          description: "CNG orchestrator dependency updates",
          groupName: "qa-cng",
          matchFileNames: ["qa/gems/gitlab-cng/*"],
          // cng orchestrator is part of main qa Gemfile
          // when runtime deps are updated, it needs to be reflected in main Gemfile.lock as well
          postUpgradeTasks: {
            commands: ["bundle install --gemfile ../../Gemfile"],
            fileFilters: ["Gemfile.lock"],
            executionMode: "branch",
          },
        },
        {
          // activesupport needs to be in sync with gitlab
          // fog-core is not currently upgradeable due to compatibility issues
          matchPackageNames: ["activesupport", "fog-core", "googleauth"],
          enabled: false,
        },
      ],
    },
  ],
  {
    allowedPostUpgradeCommands: ["^bundle install"],
  }
);
