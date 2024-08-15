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
      'config/templates/omnibus-gitlab-gems/*'
    ],
    semanticCommits: "disabled",
    reviewers: availableRouletteReviewerByRole("omnibus-gitlab", [
      "reviewer",
      "trainee_maintainer",
    ]),
    reviewersSampleSize: 1,
    labels: distributionLabels,
    enabledManagers: ["custom.regex", "bundler"], 
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
        {
          // In bundler we use an allowlist
          // Default is to exclude dependency from renovate
          matchManagers: ["bundler"],
          matchPackagePatterns: ["*"],
          excludePackagePatterns: ["chef", "ohai","mixlib-log"],
          enabled: false
        },
        {
          matchManagers: ["bundler"],
          fileMatch: ["config/templates/omnibus-gitlab-gems/Gemfile"],
          matchPackagePatterns: ["chef", "ohai", "mixlib-log"],
          groupName: "chef",
          versioning: "ruby",
          rangeStrategy: "replace"
        }
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
        fileMatch: ["config/software/pgbouncer.rb"],
        matchStrings: [
          "Gitlab::Version.new\\('pgbouncer', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "pgbouncer/pgbouncer",
        datasourceTemplate: "github-releases",
        extractVersionTemplate: "^(?<version>.+?)(?:-fixed)?$",
        versioningTemplate: "regex:^pgbouncer_(?<major>\\d+)\\_(?<minor>\\d+)\\_(?<patch>\\d+)$",
      },
      {
        customType: "regex",
        fileMatch: ["config/software/pgbouncer-exporter.rb"],
        matchStrings: [
          "Gitlab::Version.new\\('pgbouncer-exporter', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "pgbouncer_exporter",
        datasourceTemplate: "gitlab-tags",
        registryUrlTemplate: "https://gitlab.com/",
        packageNameTemplate: "gitlab-org/build/omnibus-mirror/pgbouncer_exporter",
      },
      {
        customType: "regex",
        fileMatch: ["config/software/libarchive.rb"],
        matchStrings: [
          "default_version '(?<currentValue>.*)'",
        ],
        depNameTemplate: "libarchive/libarchive",
        datasourceTemplate: "github-releases",
      },
      {
        customType: "regex",
        fileMatch: ["config/software/rubygems.rb"],
        matchStrings: ["default_version '(?<currentValue>.*)'"],
        depNameTemplate: "rubygems",
        packageNameTemplate: "rubygems-update",
        datasourceTemplate: "rubygems",
      },
      {
        customType: "regex",
        fileMatch: ["config/software/prometheus.rb"],
        matchStrings: [
          "Gitlab::Version.new\\('prometheus', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "prometheus/prometheus",
        datasourceTemplate: "github-releases",
      },
      {
        customType: "regex",
        fileMatch: ["config/software/chef-acme.rb"], 
        matchStrings: [
          "Gitlab::Version.new\\(name, 'v(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "chef-acme",
        packageNameTemplate: "schubergphilis/chef-acme",
        datasourceTemplate: "github-tags",
        extractVersionTemplate: "^v?(?<version>.+)$",
      },
      {
        customType: "regex",
        fileMatch: ["config/software/chef-gem.rb"], 
        matchStrings: [ "default_version '(?<currentValue>.*)'"],
        registryUrlTemplate: "https://packagecloud.io/cinc-project/stable",
        packageNameTemplate: "chef",
        depNameTemplate: "chef",
        datasourceTemplate: "rubygems",
      },
      {
        customType: "regex",
        fileMatch: ["config/software/git-filter-repo.rb"],
        matchStrings: [
          "Gitlab::Version.new\\('git-filter-repo', 'v(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "git-filter-repo",
        datasourceTemplate: "pypi",
      },
    ],
  }],
  {
    allowedPostUpgradeCommands: [
      "^./scripts/renovate/checksums/software/libxml2.sh$",
      "^./scripts/renovate/checksums/software/libarchive.sh$",
    ],
  },
);
