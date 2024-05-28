const {
  createServerConfig,
  baseConfig,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/omnibus-gitlab",
    ...baseConfig,
    includePaths: [
      'config/software/*',
    ], 
    semanticCommits: "disabled",
    reviewers: availableRouletteReviewerByRole("omnibus-gitlab", [
      "reviewer",
      "trainee_maintainer",
      "maintainer",
    ]),
    reviewersSampleSize: 1,
    labels: [
      "group::distribution",
      "devops::systems",
      "section::core platform",
      "type::maintenance",
      "maintenance::dependency",
      "workflow::ready for review",
    ],
    enabledManagers: ["custom.regex"],
    separateMinorPatch: true,
    separateMultipleMajor: true,
    packageRules: [],
    customManagers: [
      {
        customType: "regex",
        fileMatch: ["config/software/libxml2.rb"],
        matchStrings: [
          "default_version '(?<currentValue>.*)'",
          "version\('(?<currentValue>.*)'\)",
        ],
        depNameTemplate: "libxml2",
        datasourceTemplate: "gitlab-tags",
        registryUrlTemplate: "https://gitlab.gnome.org/",
        packageNameTemplate: "GNOME/libxml2",
      },
      {
        customType: "regex",
        fileMatch: ["config/software/registry.rb"],
        matchStrings: [
          "Gitlab::Version.new\('registry', '(?<currentValue>.*)'\)"
        ],
        depNameTemplate: "registry",
        datasourceTemplate: "gitlab-tags",
        registryUrlTemplate: "https://gitlab.com/",
        packageNameTemplate: "gitlab-org/container-registry",
      },
    ],
  },
]);
