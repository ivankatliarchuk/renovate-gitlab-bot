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
        enabled: true,
        includePaths: ["kubectl/*", "ci_files/*"],
        fileMatch: [
          "kubectl/Dockerfile",
          "kubectl/Dockerfile.build.ubi8",
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
        enabled: true,
        includePaths: ["gitlab-ruby/*"],
        fileMatch: [
          "gitlab-ruby/Dockerfile",
          "gitlab-ruby/Dockerfile.build.ubi8",
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
        enabled: true,
        includePaths: ["gitlab-ruby/*"],
        fileMatch: [
          "gitlab-ruby/Dockerfile",
          "gitlab-ruby/Dockerfile.build.ubi8",
        ],
        matchStrings: [
          "ARG BUNDLER_VERSION=(?<currentValue>.*)\n"
        ],
        depNameTemplate: "bundler",
        packageNameTemplate: "bundler",
        datasourceTemplate: "rubygems",
      },
      {
        enabled: true,
        customType: "regex",
        includePaths: [
          "gitlab-toolbox/*",
          "ci_files/*",
        ],
        fileMatch: [
          "^gitlab-toolbox/Dockerfile$",
          "^gitlab-toolbox/Dockerfile.build.ubi8$",
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
      ...updateDangerReviewComponent.customManagers,
    ],
  },
]);
