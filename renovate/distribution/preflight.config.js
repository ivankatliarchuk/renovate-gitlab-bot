const {
  createServerConfig,
  baseConfig,
  distributionLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/preflight",
    ...baseConfig,
    labels: distributionLabels,
    // For now we have no formal reviewers defined, so listing explicitely
    reviewers: ["deriamis", "WarheadsSE", "dmakovey", "balasankarc" ],
    enabledManagers: ["custom.regex"],
    semanticCommits: "disabled",
    // https://github.com/redhat-openshift-ecosystem/openshift-preflight/releases/download/${PREFLIGHT_VERSION}/preflight-linux-amd64
    customManagers: [
      {
        customType: "regex",
        fileMatch: [
          "Dockerfile",
        ],
        matchStrings: [
          'ARG PREFLIGHT_VERSION="(?<currentValue>.*)"',
          'ARG PREFLIGHT_VERSION=(?<currentValue>.*)',
        ],
        depNameTemplate: "redhat-openshift-ecosystem/openshift-preflight",
        datasourceTemplate: "github-releases",
      },
      {
        customType: "regex",
        fileMatch: [
          "Dockerfile",
        ],
        matchStrings: [
          "ARG YQ_VERSION=\"(?<currentValue>.*)\"",
          "ARG YQ_VERSION=(?<currentValue>.*)",
        ],
        depNameTemplate: "mikefarah/yq",
        datasourceTemplate: "github-releases",
      },
    ]
  },
]);
