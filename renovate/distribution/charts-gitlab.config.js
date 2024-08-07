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
      {
        customType: "regex",
        includePaths: ["doc/charts/registry/*", "charts/registry/*"],
        fileMatch: [
          "doc/charts/registry/index.md",
          "charts/registry/Chart.yaml",
          "charts/registry/values.yaml",
        ],
        matchStrings: [
          "(?<currentValue>v(\\d+\\.\\d+\\.\\d+-gitlab))"
        ],
        depNameTemplate: "container-registry",
        datasourceTemplate: "gitlab-tags",
        registryUrlTemplate: "https://gitlab.com/",
        packageNameTemplate: "gitlab-org/container-registry",
        versioningTemplate: "regex:^v(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)-gitlab$", // only `-gitlab` tags/versions
      },
      {
        customType: "regex",
        includePaths: ["charts/gitlab/charts/gitlab-exporter/*"],
        fileMatch: [
          "charts/gitlab/charts/gitlab-exporter/Chart.yaml",
        ],
        matchStrings: [
          "appVersion:\\s*(?<currentValue>\\S+)"
        ],
        depNameTemplate: "gitlab-exporter",
        datasourceTemplate: "gitlab-releases",
        registryUrlTemplate: "https://gitlab.com/",
        packageNameTemplate: "gitlab-org/gitlab-exporter",
      },
      {
        customType: "regex",
        fileMatch: [
          ".gitlab-ci.yml",
        ],
        matchStrings: [
          "GITLAB_QA_VERSION: \"(?<currentValue>\\S+)\""
        ],
        depNameTemplate: "gitlab-qa",
        datasourceTemplate: "gitlab-tags",
        registryUrlTemplate: "https://gitlab.com/",
        packageNameTemplate: "gitlab-org/gitlab-qa",
      },
      ...updateDangerReviewComponent.customManagers,
    ],
  },
]);
