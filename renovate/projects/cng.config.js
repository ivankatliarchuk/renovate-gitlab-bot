const {
  createServerConfig,
  baseConfig,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
  
module.exports = createServerConfig(
  [
    {
      repository: "gitlab-renovate-forks/CNG",
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
      packageRules: [
        {
          matchPackageNames: ["docker"],
          matchDatasources: ["docker"],
          matchManagers: ["regex"],
          customChangelogUrl: "https://github.com/moby/moby",
        },
      ],
      regexManagers: [
        {
          fileMatch: [".gitlab-ci.yml"],
          matchStrings: ["DOCKER_VERSION: \"?(?<currentValue>.*)\"?\n"],
          depNameTemplate: "docker",
          datasourceTemplate: "docker",
        },
        {
          enabled: true,
          includePaths: [
            "kubectl/*",
            "ci_files/*",
          ],
          fileMatch: [
            "kubectl/Dockerfile",
            "kubectl/Dockerfile.build.ubi8",
            "ci_files/variables.yml",
          ],
          matchStrings: ["KUBECTL_VERSION(=|: ?)\"?(?<currentValue>.*)\"?"],
          depNameTemplate: "kubectl",
          packageNameTemplate: "kubernetes/kubernetes",
          datasourceTemplate: "github-tags",
          extractVersionTemplate: "^v?(?<version>.+)$",
          versioningTemplate: "regex:^1\\.(?<major>\\d+)\\.(?<minor>\\d+)$", // kubernetes does not follow semver
        },
      ],
    },
  ],
);
  