const {
  createServerConfig,
  defaultLabels,
  baseConfig,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-agent",
    ...baseConfig,
    reviewers: availableRouletteReviewerByRole("gitlab-agent", [
      "maintainer",
      "trainee_maintainer",
    ]),
    labels: [
      ...defaultLabels,
      "group::environments",
      "devops::deploy",
      "section::cd",
    ],
    postUpdateOptions: [],
    enabledManagers: ["regex"],
    includePaths: ["*", ".gitlab/*"],
    packageRules: [
      {
        matchDepNames: ["gitlab-agent-ci-image"],
        groupName: "gitlab-agent-ci-image",
      },
      {
        matchDepNames: ["base container images"],
        groupName: "gitlab-agent-base-container-images",
        extends: ["schedule:weekly"],
      },
      {
        matchPaths: ["gitlab-agent/internal/module/starboard_vulnerability/*"],
        reviewers: ["nilieskou"],
      },
    ],
    regexManagers: [
      {
        fileMatch: [".gitlab/.gitlab-ci.yml"],
        matchStrings: [
          '\n\\s*BUILD_IMAGE_SHA:\\s*"(?<currentValue>[^@]+)@(?<currentDigest>sha256:[a-f0-9]+)"\n',
        ],
        depNameTemplate: "gitlab-agent-ci-image",
        packageNameTemplate: "gitlab/gitlab-agent-ci-image",
        datasourceTemplate: "docker",
      },
      {
        fileMatch: [".gitlab/.gitlab-ci.yml"],
        matchStrings: [
          '\n\\s*FIPS_BUILD_IMAGE_SHA:\\s*"(?<currentValue>[^@]+)@(?<currentDigest>sha256:[a-f0-9]+)"\n',
        ],
        depNameTemplate: "gitlab-agent-ci-image",
        packageNameTemplate: "gitlab/gitlab-agent-ci-image",
        datasourceTemplate: "docker",
      },
      {
        fileMatch: [".gitlab/.gitlab-ci.yml"],
        matchStrings: ['\n\\s*DOCKER_VERSION:\\s*"(?<currentValue>[^"]+)"'],
        depNameTemplate: "docker",
        datasourceTemplate: "docker",
      },
      {
        fileMatch: ["WORKSPACE"],
        matchStrings: [
          "\n#\\s*(?<currentValue>\\S+)\\s+from.*?\n" +
            "\\s*oci_pull\\(\n" +
            '\\s*name\\s*=\\s*"[^"]+",\n' +
            '\\s*digest\\s*=\\s*"(?<currentDigest>sha256:[a-f0-9]+)",\n' +
            '\\s*image\\s*=\\s*"(?<image>[^"]+)"',
        ],
        depNameTemplate: "base container images",
        packageNameTemplate: "{{{image}}}",
        datasourceTemplate: "docker",
      },
      {
        includePaths: ["internal/module/starboard_vulnerability/agent/*"],
        fileMatch: ["internal/module/starboard_vulnerability/agent/scanner.go"],
        matchStrings: ['\n\\s*trivyK8sWrapper\\s*=\\s*"registry.gitlab.com/security-products/trivy-k8s-wrapper:(?<currentValue>.*)"\n'],
        datasourceTemplate: "gitlab-releases", // although it is a docker image, use gitlab-releases so we get richer information in the MR
        registryUrlTemplate: "https://gitlab.com",
        depNameTemplate: "trivy-k8s-wrapper",
        packageNameTemplate: "gitlab-org/security-products/analyzers/trivy-k8s-wrapper",
        extractVersionTemplate: "^v(?<version>.*)$",
      },
    ],
  },
]);
