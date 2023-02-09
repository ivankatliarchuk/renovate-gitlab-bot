const { createServerConfig, defaultLabels, baseConfig } = require("../shared");

const groupConfigureLabels = [
  ...defaultLabels,
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
    postUpdateOptions: [],
    regexManagers: [
      // GitLab KAS version
      {
        fileMatch: ["GITLAB_KAS_VERSION"],
        matchStrings: ["(?<currentValue>.*)\n"],
        datasourceTemplate: "gitlab-releases", // although it is a docker image, use gitlab-releases so we get richer information in the MR
        registryUrlTemplate: "https://gitlab.com",
        depNameTemplate: "gitlab-org/cluster-integration/gitlab-agent",
      },
    ],
  },
]);
