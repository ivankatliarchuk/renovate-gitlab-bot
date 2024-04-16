const {
  createServerConfig,
  baseConfig,
  defaultLabels,
} = require("../lib/shared");

const groupEnvironmentsLabels = [
  ...defaultLabels,
  "group::environments",
  "devops::deploy",
  "section::cd",
];

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/charts-gitlab-agent",
    ...baseConfig,
    enabledManagers: ["custom.regex"],
    semanticCommits: "disabled",
    reviewers: ["timofurrer", "ash2k", "takax"],
    reviewersSampleSize: 2,
    labels: groupEnvironmentsLabels,
    customManagers: [
      {
        customType: "regex",
        fileMatch: ["Chart.yaml"],
        matchStrings: ["appVersion: (?<currentValue>.*)\n"],
        datasourceTemplate: "gitlab-releases",
        registryUrlTemplate: "https://gitlab.com",
        depNameTemplate: "gitlab-agent",
        packageNameTemplate: "gitlab-org/cluster-integration/gitlab-agent",
      },
    ],
  },
]);
