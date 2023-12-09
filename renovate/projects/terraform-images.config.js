const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/terraform-images",
    ...baseConfig,
    extends: ["group:commitlintMonorepo"],
    labels: [
      ...defaultLabels,
      "group::environments",
      "Category:Infrastructure as Code",
    ],
    enabledManagers: ["gitlabci", "npm", "regex"],
    reviewers: availableRouletteReviewerByRole("terraform-images"),
    packageRules: [
      {
        matchPackageNames: ["docker"],
        matchDatasources: ["docker"],
        matchManagers: ["regex"],
        customChangelogUrl: "https://github.com/moby/moby",
      },
      {
        matchPackageNames: ["hashicorp/terraform"],
        matchManagers: ["regex"],
        allowedVersions: "<=1.5",
        separateMinorPatch: true,
      },
      {
        matchPackageNames: ["hashicorp/terraform"],
        matchManagers: ["regex"],
        matchUpdateTypes: ["major", "minor"],
        enabled: false,
      },
      {
        matchPackageNames: "alpine_edge/opentofu",
        prBodyDefinitions: {
          Package: "[{{{depName}}}](https://github.com/opentofu/opentofu)",
        },
        prBodyNotes:
          ":information_source: [OpenTofu Changelog](https://github.com/opentofu/opentofu/blob/main/CHANGELOG.md)",
        customChangelogUrl: "https://github.com/opentofu/opentofu",
      },
    ],
    regexManagers: [
      {
        fileMatch: ["^.gitlab-ci.yml$"],
        matchStrings: ['BASE_IMAGE: "(?<depName>.*):(?<currentValue>.*)"\\s'],
        datasourceTemplate: "docker",
      },
      {
        fileMatch: ["^.gitlab-ci.yml$"],
        matchStrings: [
          'DOCKER_DIND_IMAGE: "(?<depName>.*):(?<currentValue>.*)-dind"\\s',
        ],
        datasourceTemplate: "docker",
      },
      {
        fileMatch: ["^.gitlab-ci.yml$"],
        matchStrings: ['TERRAFORM_BINARY_VERSION: "(?<currentValue>.*)"\\s'],
        depNameTemplate: "hashicorp/terraform",
        datasourceTemplate: "github-releases",
        extractVersionTemplate: "^v(?<version>.*)$",
      },
      {
        fileMatch: ["^.gitlab-ci.yml$"],
        matchStrings: ['TOFU_BINARY_VERSION: "(?<currentValue>.*)"\\s'],
        depNameTemplate: "alpine_edge/opentofu",
        datasourceTemplate: "repology",
        versioningTemplate: "loose",
      },
    ],
  },
]);
