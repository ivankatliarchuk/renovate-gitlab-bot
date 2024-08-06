const {
  createServerConfig,
  baseConfig,
  distributionLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/charts-gitlab",
    ...baseConfig,
    semanticCommits: "disabled",
    reviewers: availableRouletteReviewerByRole("gitlab-chart", [
      "reviewer",
      "trainee_maintainer",
    ]),
    reviewersSampleSize: 1,
    labels: distributionLabels,
    enabledManagers: [
      "custom.regex",
    ],
    separateMinorPatch: false, // This flag is being evaluated on https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/issues/68
    separateMultipleMajor: true, // so that we get an MR for each minor of kubectl
    commitBody: "Changelog: changed",
    packageRules: [
      {
        matchPackageNames: ["cert-manager"],
        matchManagers: ["custom.regex"],
        allowedVersions: "<1.13.0",
      },
    ],
    customManagers: [
      {
        customType: "regex",
        fileMatch: ["requirements.yaml"],
        matchStrings: [
          "name:\\s*cert-manager\\s*\\n\\s*version:\\s*(?<currentValue>.*)\\s"
        ],
        depNameTemplate: "cert-manager",
        packageNameTemplate: "cert-manager",
        registryUrlTemplate: "https://charts.jetstack.io/",
        datasourceTemplate: "helm",
      },
      {
        customType: "regex",
        fileMatch: ["requirements.yaml"],
        matchStrings: [
          "name:\\s*gitlab-runner\\s*\\n\\s*version:\\s*(?<currentValue>.*)\\s"
        ],
        depNameTemplate: "gitlab-runner",
        packageNameTemplate: "gitlab-runner",
        registryUrlTemplate: "https://charts.gitlab.io",
        datasourceTemplate: "helm",
      },
      ...updateDangerReviewComponent.customManagers,
    ],
  },
]);
