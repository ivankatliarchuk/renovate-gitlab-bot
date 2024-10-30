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
    prBodyNotes: "### Notes for Reviewer\n\n"+
                 "* [For security reasons](https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/blob/main/docs/setting-up-a-new-project.md#ci-protected-variables-secrets-and-renovate-forks), our Renovate fork cannot trigger chart pipelines\n"+
                 "\t* :warning: Reviewer needs to initiate new MR pipeline, subsequently triggering chart pipeline from it. :warning:",
    packageRules: [
      {
        matchPackageNames: ["docker"],
        matchDatasources: ["docker"],
        matchManagers: ["custom.regex"],
        customChangelogUrl: "https://github.com/moby/moby",
        minimumReleaseAge: "3 days",
        internalChecksFilter: "strict",
        addLabels: ["Docker"],
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
      {
        matchPackageNames: [
          "hairyhenderson/gomplate"
        ],
        matchManagers: [
          "custom.regex"
        ],
        allowedVersions: "<4.0.0"
      },
      {
        matchPackageNames: ["golang-fips/go"],
        matchManagers: ["custom.regex"],
        allowedVersions: "<1.24.0",
        groupName: "golang-fips/go"
      },
      {
        matchPackageNames: ["golang/go"],
        matchManagers: ["custom.regex"],
        allowedVersions: "<1.24.0",
	groupName: "golang/go"
      },
      {
        matchPackageNames: ["python/cpython"],
        allowedVersions: "<3.10.0"
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
        includePaths: ["ci_files/*"],
        fileMatch: ["ci_files/variables.yml"],
        matchStrings: ["RUBYGEMS_VERSION: \"(?<currentValue>.*)\""],
        depNameTemplate: "rubygems",
        packageNameTemplate: "rubygems-update",
        datasourceTemplate: "rubygems",
      },
      {
        customType: "regex",
        includePaths: ["ci_files/*"],
        fileMatch: ["ci_files/variables.yml"],
        matchStrings: ["BUNDLER_VERSION: \"(?<currentValue>.*)\""],
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
      {
        customType: "regex",
        includePaths: [
          "gitlab-toolbox/*",
        ],
        fileMatch: [
          "^gitlab-toolbox/Dockerfile$",
          "^gitlab-toolbox/Dockerfile.build.ubi$"
        ],
        matchStrings: [
          "GSUTIL_VERSION=\"?(?<currentValue>[^\"\\s]+)\"?"
        ],
        depNameTemplate: "GoogleCloudPlatform/gsutil",
        datasourceTemplate: "github-tags",
        extractVersionTemplate: "^v?(?<version>.*)$"
      },
      {
        customType: "regex",
        includePaths: [
          "gitlab-exiftool/*",
          "ci_files/*",
        ],
        fileMatch: [
          "^gitlab-exiftool/Dockerfile$",
          "^gitlab-exiftool/Dockerfile.build.ubi$",
          "^ci_files/variables.yml$"
        ],
        matchStrings: [
          "EXIFTOOL_VERSION=\"?(?<currentValue>[^\"\\s]+)\"?",
          "EXIFTOOL_VERSION: \"(?<currentValue>.*)\"",
        ],
        depNameTemplate: "exiftool/exiftool",
        datasourceTemplate: "github-tags"
      },
      {
        customType: "regex",
        includePaths: [
          "gitlab-gomplate/*",
          "ci_files/*",
        ],
        fileMatch: [
          "^gitlab-gomplate/Dockerfile$",
          "^gitlab-gomplate/Dockerfile.build.ubi$",
          "^ci_files/variables.yml$"
        ],
        matchStrings: [
          "GOMPLATE_VERSION=\"?v(?<currentValue>[^\"\\s]+)\"?",
          "GOMPLATE_VERSION: \"v(?<currentValue>\\S+)\""
        ],
        depNameTemplate: "hairyhenderson/gomplate",
        datasourceTemplate: "github-tags",
        extractVersionTemplate: "^v?(?<version>.*)$"
      },
      {
          customType: "regex",
          includePaths: [
            "ci_files/*",
            "gitlab-go/*"
          ],
          fileMatch: [
              "^ci_files/variables.yml$",
              "^gitlab-go/Dockerfile.build.fips$"
          ],
          matchStrings: [
              "GO_FIPS_TAG:\\s*\"(?<currentValue>\\S+)\"",
              "GO_FIPS_TAG=(?<currentValue>\\S+)"
          ],
          depNameTemplate: "golang-fips/go",
          packageNameTemplate: "golang-fips/go",
          datasourceTemplate: "github-tags",
          versioningTemplate: "regex:^go(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)-(?<build>\\d+)-openssl-fips$"
      },
      {
          customType: "regex",
          includePaths: [
            "ci_files/*",
            "gitlab-go/*"
          ],
          fileMatch: [
              "^ci_files/variables.yml$",
              "^gitlab-go/Dockerfile.build.fips$"
          ],
          matchStrings: [
              "ARG GO_VERSION=(?<currentValue>\\S+)\\n",
              "GO_FIPS_VERSION:\\s*\"(?<currentValue>\\S+)\"\\n"
          ],
          depNameTemplate: "golang-fips/go-version",
          packageNameTemplate: "golang-fips/go",
          datasourceTemplate: "github-tags",
          extractVersionTemplate: "^go(?<version>.*)-\\d+-openssl-fips$"
      },
      {
        customType: "regex",
        includePaths: [
          "ci_files/*",
          "gitlab-go/*",
        ],
        fileMatch: [
          "^ci_files/variables.yml$",
          "^gitlab-go/Dockerfile$",
          "^gitlab-go/Dockerfile.build.ubi$"
        ],
        matchStrings: [
          "ARG GO_VERSION=(?<currentValue>\\S+)",
          "GO_VERSION: \"(?<currentValue>\\S+)\""
        ],
        depNameTemplate: "golang/go",
        datasourceTemplate: "github-tags",
        extractVersionTemplate: "go(?<version>\\d+\\.\\d+\\.\\d+)"
      },
      {
        customType: "regex",
        includePaths: [
          "ci_files/*",
          "gitlab-container-registry/*",
        ],
        fileMatch: [
          "^ci_files/variables.yml$",
          "^gitlab-container-registry/Dockerfile$",
          "^gitlab-container-registry/Dockerfile.build.ubi$"
        ],
        matchStrings: [
          "GITLAB_CONTAINER_REGISTRY_VERSION: \"(?<currentValue>\\S+)\"",
          "ARG REGISTRY_VERSION=(?<currentValue>\\S+)"
        ],
        depNameTemplate: "gitlab-org/container-registry",
        datasourceTemplate: "gitlab-tags",
        versioningTemplate: "regex:^v(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)-gitlab$"
      },
      {
        customType: "regex",
        includePaths: [
          "gitlab-mailroom/scripts/*",
          "gitlab-mailroom/*",
        ],
        fileMatch: [
          "^gitlab-mailroom/scripts/install-dependencies$",
          "^gitlab-mailroom/Dockerfile.build.ubi$"
        ],
        matchStrings: [
          "redis-client:(?<currentValue>\\S+)"
        ],
        depNameTemplate: "redis-client",
        packageNameTemplate: "redis-client",
        datasourceTemplate: "rubygems"
      },
      {
        customType: "regex",
        includePaths: [
          "gitlab-mailroom/scripts/*",
          "gitlab-mailroom/*",
        ],
        fileMatch: [
          "^gitlab-mailroom/scripts/install-dependencies$",
          "^gitlab-mailroom/Dockerfile.build.ubi$"
        ],
        matchStrings: [
          "redis:(?<currentValue>\\S+)"
        ],
        depNameTemplate: "redis",
        packageNameTemplate: "redis",
        datasourceTemplate: "rubygems"
      },
      {
        customType: "regex",
        includePaths: [
          "ci_files/*",
          "gitlab-toolbox/*",
        ],
        fileMatch: [
          "^ci_files/variables.yml$",
          "^gitlab-toolbox/Dockerfile$",
          "^gitlab-toolbox/Dockerfile.build.ubi$"
        ],
        matchStrings: [
          "S3CMD_VERSION: \"(?<currentValue>\\S+)\"",
          "ARG S3CMD_VERSION=\"?(?<currentValue>[^\"\\s]+)\"?"
        ],
        depNameTemplate: "s3tools/s3cmd",
        datasourceTemplate: "github-tags",
        extractVersionTemplate: "^v?(?<version>.*)$"
      },
      {
        customType: "regex",
        includePaths: [
          "ci_files/*",
          "gitlab-python/*",
          "gitlab-sidekiq/*",
          "gitlab-toolbox/*",
          "gitaly/*",
          "gitlab-webservice/*",
        ],
        fileMatch: [
          "^gitlab-python/Dockerfile$",
          "^gitlab-python/Dockerfile.build.ubi$",
          "^gitlab-sidekiq/Dockerfile$",
          "^gitlab-toolbox/Dockerfile$",
          "^gitaly/Dockerfile$",
          "^gitlab-webservice/Dockerfile$",
          "^ci_files/variables.yml$"
        ],
        matchStrings: [
          "ARG PYTHON_VERSION=\"?(?<currentValue>[^\"\\s]+)\"?",
          "ARG PYTHON_TAG=\"?(?<currentValue>[^\"\\s]+)\"?",
          "PYTHON_VERSION: \"(?<currentValue>\\S+)\""
        ],
        depNameTemplate: "python/cpython",
        datasourceTemplate: "github-tags",
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
