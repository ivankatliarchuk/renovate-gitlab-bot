const { createServerConfig, baseConfig } = require("../shared");

const baseLabels = [
  "type::maintenance",
  "maintenance::dependency",
  "automation:bot-authored",
];

const groupConfigureLabels = [
  ...baseLabels,
  "group::configure",
  "devops::configure",
  "section::ops",
];

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab",
    dependencyDashboardTitle: "Dependency Dashboard (Version Files)",
    ...baseConfig,
    branchPrefix: "renovate-vfiles/",
    enabledManagers: ["regex"],
    semanticCommits: "disabled",
    // reviewers: ["ashmckenzie", "tkuah"],
    reviewers: ["ash2k"],
    labels: groupConfigureLabels,
    includePaths: ["GITLAB_KAS_VERSION"],
    regexManagers: [
      // GitLab KAS version
      {
        enabled: true,
        fileMatch: ["GITLAB_KAS_VERSION"],
        matchStrings: ["(?<currentValue>.*)\n"],
        datasource: "gitlab-releases", // although it is a docker image, use gitlab-releases so we get richer information in the MR
        registryUrl: "https://gitlab.com",
        packageNameTemplate: "gitlab-org/cluster-integration/gitlab-agent",
        depNameTemplate: "gitlab-agent",
      },
    ],
  },
]);
