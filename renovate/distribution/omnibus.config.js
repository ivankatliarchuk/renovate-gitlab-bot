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
      'config/templates/omnibus-gitlab-gems/*',
      'files/gitlab-ctl-commands-ee/lib/*',
      'files/gitlab-cookbooks/consul/**'
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
          // In bundler we use an allowlist. Default to exclude. 
          matchManagers: ["bundler"],
          matchPackagePatterns: ["*"],
          excludePackagePatterns: ["chef", "ohai", "acme-client"],
          enabled: false
        },
        {
          matchManagers: ["bundler"],
          matchPackagePatterns: ["*"],
          versioning: "ruby",
          rangeStrategy: "replace"
        },
        {
          matchfileNames: [
            "config/templates/omnibus-gitlab-gems/Gemfile",
            "config/software/chef-gem.rb"
          ],
          matchPackagePatterns: ["chef", "ohai"],
          groupName: "chef",
        },
        {
          // groups are overriden based on order, therefore
          // chef-acme will be in the acme group, not chef.
          matchfileNames: [
            "config/templates/omnibus-gitlab-gems/Gemfile",
            "config/software/chef-acme.rb"
          ],
          matchPackagePatterns: ["acme"],
          groupName: "acme"
        },
        {
          matchPackagePatterns: [ "^chef$", "^chef-bin$", "^ohai$" ],
          allowedVersions: "< 19.0"
        },
        {
          matchPackagePatterns: [ "^consul$"],
          allowedVersions: "< 1.19.0"
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
      {
        customType: "regex",
        fileMatch: ["config/software/alertmanager.rb"], 
        matchStrings: [
          "Gitlab::Version.new\\('alertmanager', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "alertmanager",
        packageNameTemplate: "gitlab-org/build/omnibus-mirror/alertmanager",
        datasourceTemplate: "gitlab-tags",
        extractVersionTemplate: "^v?(?<version>.+)$"
      },
      {
        customType: "regex",
        fileMatch: ["config/software/compat_resource.rb"], 
        matchStrings: [
          "Gitlab::Version.new\\('compat_resource', 'v(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "compat_resource",
        packageNameTemplate: "chef-boneyard/compat_resource",
        datasourceTemplate: "github-tags",
        extractVersionTemplate: "^v?(?<version>.+)$",
      },
      {
        customType: "regex",
        fileMatch: [
          "config/software/consul.rb",
          "files/gitlab-ctl-commands-ee/lib/consul_download.rb",
          "files/gitlab-cookbooks/consul/libraries/consul_helper.rb"
        ], 
        matchStrings: [
          "Gitlab::Version.new\\('consul', 'v(?<currentValue>.*)'\\)",
          "DEFAULT_VERSION = (?<currentValue>.*)",
          "SUPPORTED_MINOR = (?<currentValue>.*)"
        ],
        depNameTemplate: "consul",
        packageNameTemplate: "hashicorp/consul",
        datasourceTemplate: "github-tags",
        extractVersionTemplate: "^v?(?<version>.+)$",
      },
      {
        customType: "regex",
        fileMatch: ["config/software/exiftool.rb"],
        matchStrings: [
          "Gitlab::Version.new\\('exiftool', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "exiftool/exiftool",
        datasourceTemplate: "github-tags",
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
