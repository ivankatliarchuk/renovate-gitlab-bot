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
        matchPackagePatterns: ["^chef$", "^chef-bin$", "^ohai$"],
        allowedVersions: "< 19.0"
      },
      {
        matchPackagePatterns: ["^consul$"],
        allowedVersions: "< 1.19.0"
      },
      {
        matchPackageNames: ["redis/redis"],
        allowedVersions: "< 7.2.0"
      },
      {
        matchPackageNames: ["libjpeg-turbo/libjpeg-turbo"],
        allowedVersions: "< 2.1.90"
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
        matchStrings: ["default_version '(?<currentValue>.*)'"],
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
      {
        customType: "regex",
        fileMatch: [
          "config/software/curl.rb"
        ],
        matchStrings: [
          "Gitlab::Version.new\\('curl', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "curl/curl",
        datasourceTemplate: "github-tags",
        versioningTemplate: "regex:^curl-(?<major>\\d+)_(?<minor>\\d+)_(?<patch>\\d+)$"
      },
      {
        customType: "regex",
        fileMatch: [
          "config/software/redis.rb"
        ],
        matchStrings: [
          "Gitlab::Version.new\\('redis', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "redis/redis",
        datasourceTemplate: "github-tags"
      },
      {
        customType: "regex",
        fileMatch: [
          "config/software/libtiff.rb"
        ],
        matchStrings: [
          "Gitlab::Version.new\\('libtiff', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "libtiff/libtiff",
        datasourceTemplate: "gitlab-tags"
      },
      {
        customType: "regex",
        fileMatch: [
          "config/software/libjpeg-turbo.rb"
        ],
        matchStrings: [
          "Gitlab::Version.new\\('libjpeg-turbo', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "libjpeg-turbo/libjpeg-turbo",
        datasourceTemplate: "github-tags",
        versioningTemplate: "regex:^(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)(\\.?(?<build>\\d+))?$"
      },
      {
        customType: "regex",
        fileMatch: [
          "config/software/pcre2.rb"
        ],
        matchStrings: [
          "Gitlab::Version.new\\('pcre2', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "PCRE2Project/pcre2",
        datasourceTemplate: "github-tags",
        versioningTemplate: "regex:^pcre2-(?<major>\\d+)\\.(?<minor>\\d+)$"
      },
      {
        customType: "regex",
        fileMatch: [
          "config/software/go-crond.rb"
        ],
        matchStrings: [
          "Gitlab::Version.new\\('go-crond', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "webdevops/go-crond",
        datasourceTemplate: "github-tags"
      },
      {
        customType: "regex",
        fileMatch: [
          "config/software/jemalloc.rb"
        ],
        matchStrings: [
          "Gitlab::Version.new\\('jemalloc', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "jemalloc/jemalloc",
        datasourceTemplate: "github-tags"
      },
      {
        customType: "regex",
        fileMatch: ["config/software/libpng.rb"],
        matchStrings: [
          "Gitlab::Version.new\\('libpng', 'v(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "libpng",
        packageNameTemplate: "https://git.code.sf.net/p/libpng/code.git",
        datasourceTemplate: "git-tags",
        extractVersionTemplate: "^v?(?<version>.+)$"
      },
      {
        customType: "regex",
        fileMatch: [
          "config/software/logrotate.rb"
        ],
        matchStrings: [
          "Gitlab::Version.new\\(name, '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "gitlab-org/build/omnibus-mirror/logrotate",
        datasourceTemplate: "gitlab-tags"
      },
      {
        customType: "regex",
        fileMatch: [
          "config/software/nginx.rb"
        ],
        matchStrings: [
          "Gitlab::Version.new\\('nginx', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "nginx/nginx",
        datasourceTemplate: "github-tags",
        versioningTemplate: "regex:^release-(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)$"
      },
      {
        customType: "regex",
        fileMatch: [
          "config/software/nginx-module-vts.rb"
        ],
        matchStrings: [
          "Gitlab::Version.new\\('nginx-module-vts', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "gitlab-org/build/omnibus-mirror/nginx-module-vts",
        datasourceTemplate: "gitlab-tags",
        extractVersionTemplate: "^v(?<version>.+)$"
      },
      {
        customType: "regex",
        fileMatch: [
          "^config/software/redis-exporter.rb$"
        ],
        matchStrings: [
          "Gitlab::Version\\.new\\('redis-exporter', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "redis-exporter",
        packageNameTemplate: "gitlab-org/build/omnibus-mirror/redis_exporter",
        datasourceTemplate: "gitlab-tags",
        extractVersionTemplate: "^v(?<version>.+)$"
      },
      {
        customType: "regex",
        fileMatch: [
          "^config/software/postgres-exporter.rb$"
        ],
        matchStrings: [
          "Gitlab::Version\\.new\\('postgres-exporter', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "postgres-exporter",
        packageNameTemplate: "gitlab-org/build/omnibus-mirror/postgres_exporter",
        datasourceTemplate: "gitlab-tags",
        extractVersionTemplate: "^v(?<version>.+)$"
      },
      {
        customType: "regex",
        fileMatch: [
          "^config/software/node-exporter.rb$"
        ],
        matchStrings: [
          "Gitlab::Version\\.new\\('node-exporter', '(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "node-exporter",
        packageNameTemplate: "gitlab-org/build/omnibus-mirror/node_exporter",
        datasourceTemplate: "gitlab-tags",
        extractVersionTemplate: "^v(?<version>.+)$"
      },
      {
        customType: "regex",
        fileMatch: [
          "^config/software/gitlab-exporter.rb$"
        ],
        matchStrings: [
          "default_version '(?<currentValue>.*)'"
        ],
        depNameTemplate: "gitlab-exporter",
        packageNameTemplate: "gitlab-org/gitlab-exporter",
        datasourceTemplate: "gitlab-tags",
        extractVersionTemplate: "^v(?<version>.+)$"
      },
      {
        customType: "regex",
        fileMatch: [
          "^config/software/zlib.rb$"
        ],
        matchStrings: [
          "Gitlab::Version\\.new\\('zlib', 'v(?<currentValue>.*)'\\)"
        ],
        depNameTemplate: "madler/zlib",
        datasourceTemplate: "github-tags",
        extractVersionTemplate: "^v(?<version>.+)$"
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
