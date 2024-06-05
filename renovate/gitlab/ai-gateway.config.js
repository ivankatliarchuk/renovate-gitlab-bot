const {
  createServerConfig,
  baseConfig,
  availableRouletteReviewerByRole,
  GITLAB_REPO,
} = require("../lib/shared");

const baseLabels = [
  "type::maintenance",
  "maintenance::dependency",
];

const groupAiFrameworkLabels = [
  ...baseLabels,
  "group::ai framework",
  "devops::ai-powered",
  "section::data-science",
];

const aiGatewayReviewers = availableRouletteReviewerByRole(
  "ai-gateway",
  ["reviewer", "trainee_maintainer", "maintainer"]
);

module.exports = createServerConfig([
  {
    repository: GITLAB_REPO,
    dependencyDashboardTitle: "Dependency Dashboard (AI Gateway)",
    ...baseConfig,
    branchPrefix: "renovate-ai-gateway/",
    enabledManagers: ["custom.regex"],
    semanticCommits: "disabled",
    reviewers: aiGatewayReviewers,
    reviewersSampleSize: 1,
    labels: baseLabels,
    includePaths: [".gitlab/ci/**/*"],
    commitBody: "Changelog: changed",
    packageRules: [
      {
        groupName: "ai-gateway labels and reviewers",
        matchPackageNames: ["ai-gateway"],
        reviewers: aiGatewayReviewers,
        labels: groupAiFrameworkLabels,
      },
    ],
    customManagers: [
      {
        enabled: true,
        customType: "regex",
        fileMatch: [
          ".gitlab/ci/global.gitlab-ci.yml",
        ],
        matchStrings: [
          "registry.gitlab.com/gitlab-org/modelops/applied-ml/code-suggestions/ai-assist/model-gateway:(?<currentValue>.*)\n",
        ],
        datasourceTemplate: "gitlab-releases", // although it is a docker image, use gitlab-releases so we get richer information in the MR
        registryUrlTemplate: "https://gitlab.com",
        packageNameTemplate: "gitlab-org/modelops/applied-ml/code-suggestions/ai-assist",
        depNameTemplate: "ai-gateway",
      },
    ],
  },
]);
