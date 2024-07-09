const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig(
  [
    {
      repository: "gitlab-renovate-forks/opentofu",
      ...baseConfig,
      extends: ["group:commitlintMonorepo"],
      labels: [
        ...defaultLabels,
        "group::environments",
        "Category:Infrastructure as Code",
      ],
      enabledManagers: ["gitlabci", "custom.regex"],
      reviewers: ["timofurrer"],
      includePaths: [
        // NOTE: the default of renovate
        "*",
        // NOTE: the templates directory which is affected by the post upgrade tasks
        "templates/*",
      ],
      packageRules: [
        {
          matchPackageNames: ["docker"],
          matchDatasources: ["docker"],
          matchManagers: ["custom.regex"],
          customChangelogUrl: "https://github.com/moby/moby",
        },
        {
          matchDepNames: ["opentofu/opentofu"],
          matchDatasources: ["github-releases"],
          // NOTE: since OpenTofu is pretty new and fast developing,
          // let's include pre-releases.
          ignoreUnstable: false,
        },
      ],
      customManagers: [
        {
          customType: "regex",
          fileMatch: ["^.gitlab-ci.yml$"],
          matchStrings: ['BASE_IMAGE: "(?<depName>.*):(?<currentValue>.*)"\\s'],
          datasourceTemplate: "docker",
        },
        {
          customType: "regex",
          fileMatch: ["^.gitlab-ci.yml$"],
          matchStrings: [
            'DOCKER_DIND_IMAGE: "(?<depName>.*):(?<currentValue>.*)-dind"\\s',
          ],
          datasourceTemplate: "docker",
        },
        {
          customType: "regex",
          fileMatch: ["^opentofu_versions.yaml$"],
          matchStrings: ["latest_version: '(?<currentValue>.*?)'\\n"],
          depNameTemplate: "opentofu/opentofu",
          datasourceTemplate: "github-releases",
        },
      ],
      postUpgradeTasks: {
        commands: ["./.gitlab/scripts/renovate-post-upgrade.sh"],
        executionMode: "branch",
      },
    },
  ],
  {
    allowedPostUpgradeCommands: ["^./.gitlab/scripts/renovate-post-upgrade.sh$"],
  }
);
