const {
  createServerConfig,
  baseConfig,
  distributionLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

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
    ]),
    reviewersSampleSize: 1,
    labels: distributionLabels,
    enabledManagers: ["custom.regex"],
    separateMinorPatch: false, // This flag is being evaluated on https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/issues/68
    separateMultipleMajor: true,
    packageRules: [
        {
          matchPackageNames: ["GNOME/libxml2"],
          postUpgradeTasks: {
            commands: ["./scripts/renovate/checksums/software/libxml2.sh"],
            fileFilters: ["config/software/libxml2.rb"],
            executionMode: "branch",
          }
        },
        {
          matchPackageNames: ["libarchive/libarchive"],
          postUpgradeTasks: {
            commands: ["./scripts/renovate/checksums/software/libarchive.sh"],
            fileFilters: ["config/software/libarchive.rb"],
            executionMode: "branch",
          }
        },
    ],
    commitBody: "Changelog: changed",
    customManagers: [
      ...updateDangerReviewComponent.customManagers,
      {
        customType: "regex",
        fileMatch: ["config/software/libxml2.rb"],
        matchStrings: [
          "default_version '(?<currentValue>.*)'",
          "version\\('(?<currentValue>.*)'\\)",
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
          "Gitlab::Version.new\\('registry', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "registry",
        datasourceTemplate: "gitlab-tags",
        registryUrlTemplate: "https://gitlab.com/",
        packageNameTemplate: "gitlab-org/container-registry",
        versioningTemplate: "regex:^v(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)-gitlab$", // only `-gitlab` tags/versions
      },
      {
        customType: "regex",
        fileMatch: ["config/software/libarchive.rb"],
        matchStrings: [
          "default_version '(?<currentValue>.*)'",
        ],
        depNameTemplate: "libarchive/libarchive",
        datasourceTemplate: "github-releases",
      }
    ],
  }],
  {
    allowedPostUpgradeCommands: [
      "^./scripts/renovate/checksums/software/libxml2.sh$",
      "^./scripts/renovate/checksums/software/libarchive.sh$",
    ],
  },
);
