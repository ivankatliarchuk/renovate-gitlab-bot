const {
  createServerConfig,
  baseConfig,
  distributionLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/CNG",
    ...baseConfig,
    semanticCommits: "disabled",
    reviewers: availableRouletteReviewerByRole("cng", [
      "reviewer",
      "trainee_maintainer",
    ]),
    reviewersSampleSize: 1,
    labels: distributionLabels,
    enabledManagers: ["custom.regex"],
    separateMinorPatch: false, // This flag is being evaluated on https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/issues/68
    separateMultipleMajor: true, // so that we get an MR for each minor of kubectl
    commitMessageExtra: "to v{{{newVersion}}}", // renovate's default template is wonky with kubectl major version override
    commitBody: "Changelog: changed",
    packageRules: [
      {
        matchPackageNames: ["docker"],
        matchDatasources: ["docker"],
        matchManagers: ["custom.regex"],
        customChangelogUrl: "https://github.com/moby/moby",
        minimumReleaseAge: "3 days",
        internalChecksFilter: "strict",
        labels: "Docker",
      },
      {
        matchPackagePatterns: ["rubygems", "bundler"],
        groupName: "Rubygems and Bundler"
      },
      {
        matchPackageNames: ["aws/aws-cli"],
        matchManagers: ["custom.regex"],
        allowedVersions: "<2.0.0",
      },
      {
        matchPackageNames: ["Azure/azure-storage-azcopy"],
        postUpgradeTasks: {
          commands: ["./.gitlab/scripts/renovate/azcopy_update_url.sh"],
          fileFilters: [
            "gitlab-toolbox/Dockerfile",
            "gitlab-toolbox/Dockerfile.build.ubi",
          ],
          executionMode: "branch",
        }
      },
    ],
    customManagers: [
      {
        customType: "regex",
        fileMatch: [".gitlab-ci.yml"],
        matchStrings: ['DOCKER_VERSION: "?(?<currentValue>.*)"?\n'],
        depNameTemplate: "docker",
        datasourceTemplate: "docker",
      },
      {
        customType: "regex",
        includePaths: ["*", "docs/*"],
        fileMatch: [".gitlab-ci.yml", "docs/ci-variables.md"],
        matchStrings: [
          'BUILDKIT_IMAGE: "(?<depName>.*):v(?<currentValue>.*)"\\s',
          'BUILDKIT_IMAGE[^`]+`(?<depName>[^:]+):v(?<currentValue>.*)`'
        ],
        depNameTemplate: "moby/buildkit",
        datasourceTemplate: "docker",
        extractVersionTemplate: "^v?(?<version>.*)$",
      },
      {
        customType: "regex",
        includePaths: ["kubectl/*", "ci_files/*"],
        fileMatch: [
          "kubectl/Dockerfile",
          "kubectl/Dockerfile.build.ubi",
          "ci_files/variables.yml",
        ],
        matchStrings: [
          'KUBECTL_VERSION="(?<currentValue>.*)"',
          "KUBECTL_VERSION=(?<currentValue>.*)",
          'KUBECTL_VERSION: "(?<currentValue>.*)"',
        ],
        depNameTemplate: "kubectl",
        packageNameTemplate: "kubernetes/kubernetes",
        datasourceTemplate: "github-tags",
        extractVersionTemplate: "^v?(?<version>.+)$",
        versioningTemplate: "regex:^1\\.(?<major>\\d+)\\.(?<minor>\\d+)$", // kubernetes does not follow semver
      },
      {
        customType: "regex",
        includePaths: ["gitlab-ruby/*"],
        fileMatch: [
          "gitlab-ruby/Dockerfile",
          "gitlab-ruby/Dockerfile.build.ubi",
        ],
        matchStrings: [
          "ARG RUBYGEMS_VERSION=(?<currentValue>.*)\n"
        ],
        depNameTemplate: "rubygems",
        packageNameTemplate: "rubygems-update",
        datasourceTemplate: "rubygems",
      },
      {
        customType: "regex",
        includePaths: ["gitlab-ruby/*"],
        fileMatch: [
          "gitlab-ruby/Dockerfile",
          "gitlab-ruby/Dockerfile.build.ubi",
        ],
        matchStrings: [
          "ARG BUNDLER_VERSION=(?<currentValue>.*)\n"
        ],
        depNameTemplate: "bundler",
        packageNameTemplate: "bundler",
        datasourceTemplate: "rubygems",
      },
      {
        customType: "regex",
        includePaths: [
          "gitlab-toolbox/*",
          "ci_files/*",
        ],
        fileMatch: [
          "^gitlab-toolbox/Dockerfile$",
          "^gitlab-toolbox/Dockerfile.build.ubi$",
          "^ci_files/variables.yml$",
        ],
        matchStrings: [
          // With quotes
          "AWSCLI_VERSION=\"(?<currentValue>.*)\"",
          // Without quotes
          "AWSCLI_VERSION=(?<currentValue>\\d+\\.\\d+\\.\\d+)",
          "AWSCLI_VERSION: \"(?<currentValue>.*)\"",
        ],
        depNameTemplate: "aws/aws-cli",
        datasourceTemplate: "github-tags",
      },
      {
        customType: "regex",
        includePaths: [
          "gitlab-toolbox/*",
        ],
        matchStrings: [
          "ARG AZCOPY_STATIC_URL=\".*_(?<currentValue>.*).tar.gz\"",
        ],
        fileMatch: [
          "^gitlab-toolbox/Dockerfile$",
          "^gitlab-toolbox/Dockerfile.build.ubi$",
        ],
        depNameTemplate: "Azure/azure-storage-azcopy",
        datasourceTemplate: "github-releases",
      },
      {
        customType: "regex",
        includePaths: [
          "kubectl/*",
          "ci_files/*",
        ],
        fileMatch: [
          "^kubectl/Dockerfile$",
          "^kubectl/Dockerfile.build.ubi$",
          "^ci_files/variables.yml$",
        ],
        matchStrings: [
          // With quotes
          "YQ_VERSION=\"(?<currentValue>.*)\"",
          // Without quotes
          "YQ_VERSION=(?<currentValue>\\d+\\.\\d+\\.\\d+)",
          "YQ_VERSION: \"(?<currentValue>.*)\"",
        ],
        depNameTemplate: "mikefarah/yq",
        datasourceTemplate: "github-releases",
      },
      {
        customType: "regex",
        includePaths: [
          "gitlab-exporter/*",
          "ci_files/*",
        ],
        fileMatch: [
          "^gitlab-exporter/Dockerfile$",
          "^gitlab-exporter/Dockerfile.build.ubi$",
          "^ci_files/variables.yml$",
        ],
        matchStrings: [
          "GITLAB_EXPORTER_VERSION=(?<currentValue>\\d+\\.\\d+\\.\\d+)",
          "GITLAB_EXPORTER_VERSION: \"(?<currentValue>.*)\"",
        ],
        depNameTemplate: "gitlab-exporter",
        datasourceTemplate: "rubygems",
      },
      {
        customType: "regex",
        includePaths: [
          "gitaly/*",
          "ci_files/*",
        ],
        fileMatch: [
          "^gitaly/Dockerfile$",
          "^gitaly/Dockerfile.build.ubi$",
          "^ci_files/variables.yml$",
        ],
        matchStrings: [
          "ARG GIT_FILTER_REPO_VERSION=\"(?<currentValue>.*)\"",
          "GIT_FILTER_REPO_VERSION: \"(?<currentValue>.*)\"",
        ],
        depNameTemplate: "git-filter-repo",
        datasourceTemplate: "pypi",
      },
      ...updateDangerReviewComponent.customManagers,
    ],
  }],
  {
    allowedPostUpgradeCommands: [
      "^./.gitlab/scripts/renovate/azcopy_update_url.sh$",
    ],
  },
);
