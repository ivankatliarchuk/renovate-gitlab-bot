const {
  createServerConfig,
  baseConfig,
  defaultLabels,
} = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/terraform-images",
    ...baseConfig,
    labels: [
      ...defaultLabels,
      "group::environments",
      "Category:Infrastructure as Code",
    ],
    enabledManagers: ["regex"],
    reviewers: [
      "timofurrer",
      "tigerwnz",
    ],
    packageRules: [
      {
        matchPackageNames: "hashicorp/terraform",
        matchManagers: ["regex"],
        separateMinorPatch: true,
      },
      {
        matchPackageNames: "hashicorp/terraform",
        matchManagers: ["regex"],
        matchUpdateTypes: ["major", "minor"],
        enabled: false,
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
        matchStrings: ['BUILDX_VERSION: "(?<currentValue>.*)"\\s'],
        depNameTemplate: "docker/buildx",
        datasourceTemplate: "github-releases",
      },
      {
        fileMatch: ["^.gitlab-ci.yml$"],
        matchStrings: [
          'DOCKER_DIND_IMAGE: "(?<depName>.*):(?<currentValue>.*)"\\s',
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
    ],
  },
]);
