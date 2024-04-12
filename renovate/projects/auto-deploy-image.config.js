const {
  createServerConfig,
  baseConfig,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/auto-deploy-image",
    ...baseConfig,
    semanticCommits: "enabled",
    semanticCommitType: "feat",
    reviewers: availableRouletteReviewerByRole("auto-deploy-image"),
    labels: [
      "group::environments",
      "devops::deploy",
      "section::cd",
      "type::maintenance",
      "maintenance::dependency",
    ],
    enabledManagers: ["regex"],
    customManagers: [
      {
        customType: "regex",
        enabled: true,
        fileMatch: [".gitlab-ci.yml"],
        matchStrings: ["HELM_INSTALL_IMAGE_VERSION: (?<currentValue>.*)\n"],
        depNameTemplate: "helm-install-image",
        packageNameTemplate:
          "registry.gitlab.com/gitlab-org/cluster-integration/helm-install-image",
        datasourceTemplate: "docker",
        versioningTemplate: "regex:^v(?<major>\\d+)\\.(?<minor>\\d+)",
      },
    ],
  },
]);
