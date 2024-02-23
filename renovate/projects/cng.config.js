const {
    createServerConfig,
    baseConfig,
    availableRouletteReviewerByRole,
  } = require("../lib/shared");
  
  module.exports = createServerConfig(
    [
      {
        repository: "gitlab-renovate-forks/cng",
        ...baseConfig,
        semanticCommits: "disabled",
        reviewers: availableRouletteReviewerByRole("cng"),
        labels: [
          "group::distribution",
          "devops::systems",
          "section::core platform",
          "type::maintenance",
          "maintenance::dependency",
        ],
        enabledManagers: ["regex"],
        separateMinorPatch: true,
        separateMultipleMajor: true, // so that we get an MR for each minor of kubectl
        commitMessageExtra: "to v{{{newVersion}}}", // renovate's default template is wonky with kubectl major version override
        regexManagers: [
          {
            enabled: true,
            fileMatch: ["kubectl/Dockerfile", "kubectl/Dockerfile.build.ubi8", "ci_files/variables.yml"],
            matchStrings: [
              "ARG KUBECTL_VERSION=\"(?<currentValue>.*)\"\n",
              "KUBECTL_VERSION: \"(?<currentValue>.*)\"\n",
            ],
            depNameTemplate: "kubectl",
            packageNameTemplate: "kubernetes/kubernetes",
            datasourceTemplate: "github-releases",
            extractVersionTemplate: "^v(?<version>.+)$",
            versioningTemplate: "regex:^1\\.(?<major>\\d+)\\.(?<minor>\\d+)$", // kubernetes does not follow semver
          },
        ],
      },
    ],
  );
  