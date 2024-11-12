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
      dependencyDashboard: false,
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
      ],
      customManagers: [
        {
          customType: "regex",
          fileMatch: ["^Dockerfile.*$"],
          matchStrings: ['ARG BASE_IMAGE=(?<depName>.*):(?<currentValue>.*)\\s'],
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
        {
          customType: "regex",
          fileMatch: ["^Dockerfile.debian$"],
          matchStrings: ["ARG COSIGN_VERSION=(?<currentValue>.*?)\\n"],
          depNameTemplate: "sigstore/cosign",
          datasourceTemplate: "github-releases",
        },
        {
          customType: "regex",
          fileMatch: ["^Dockerfile.debian$"],
          matchStrings: ["ARG GLAB_VERSION=(?<currentValue>.*?)\\n"],
          depNameTemplate: "gitlab-org/cli",
          datasourceTemplate: "gitlab-releases",
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
