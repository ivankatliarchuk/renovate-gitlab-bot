const {
  createServerConfig,
  updateNothing,
  baseConfig,
  epBaseConfig,
  GITLAB_REPO,
} = require("../lib/shared");
const { getGemReviewers } = require("../lib/reviewers");
const { concatUnique } = require("../lib/utils");

module.exports = async function () {
  const gems = await getGemReviewers(
    "https://gitlab.com/gitlab-org/gitlab/-/raw/master/Gemfile",
    "gitlab"
  );

  const packageRules = [
    {
      matchPackageNames: [
        "better_errors",
        "brakeman",
        "danger",
        "letter_opener_web",
        "parser",
        "thin",
      ],
      enabled: true,
      groupName: "Development gems",
    },
    {
      matchPackageNames: [
        "capybara",
        "capybara-screenshot",
        "selenium-webdriver",
        "test-prof",
        "webmock",
      ],
      enabled: true,
      groupName: "Testing gems",
    },
    {
      matchPackageNames: [
        "nokogiri",
        "premailer",
        "re2",
        "rouge",
        "loofah",
        "rails-html-sanitizer",
      ],
      enabled: true,
      groupName: "Markdown and HTML parsing gems",
    },
    {
      matchPackageNames: ["pg", "marginalia"],
      enabled: true,
      groupName: "Database gems",
    },
    {
      matchPackageNames: [
        "rack",
        "rack-accept",
        "rack-attack",
        "rack-cors",
        "rack-oauth2",
        "rack-proxy",
        "rack-test",
        "rack-timeout",
      ],
      enabled: true,
      groupName: "Rack gems",
    },
    {
      matchPackageNames: ["aws-sdk-core", "aws-sdk-s3"],
      reviewers: ["stanhu"],
      enabled: true,
      groupName: "AWS gems",
    },
    {
      matchPackageNames: ["bootsnap"],
      enabled: true,
      reviewers: ["alipniagov", "stanhu"],
      groupName: "Bootsnap",
    },
    {
      matchPackageNames: ["lookbook", "view_component"],
      enabled: true,
      reviewers: ["thutterer"],
    },
    {
      matchPackageNames: ["google-protobuf"],
      enabled: true,
      reviewers: ["stanhu"],
      groupName: "Google Protobuf",
    },
    {
      matchPackageNames: ["gitlab-labkit"],
      enabled: true,
      reviewers: ["stanhu"],
      groupName: "GitLab LabKit",
    },
    {
      matchPackageNames: ["prometheus-client-mmap"],
      enabled: true,
      reviewers: ["stanhu", "wchandler"],
      groupName: "prometheus-client-mmap",
    },
    {
      matchPackageNames: ["sentry-ruby", "sentry-rails", "sentry-sidekiq"],
      enabled: true,
      reviewers: ["mbobin"],
      groupName: "Sentry Gems",
      separateMultipleMinor: true,
    },
    {
      matchPackageNames: ["redis", "redis-clustering"],
      enabled: true,
      groupName: "Redis Gems",
    },
    {
      matchPackagePatterns: ["^opentelemetry"],
      enabled: true,
      groupName: "Open Telemetry Gems",
    },
    {
      matchPackageNames: [
        "googleauth",
        "google-cloud-compute-v1",
        "google-cloud-artifact_registry-v1",
      ],
      // re-enable after: https://gitlab.com/gitlab-org/gitlab/-/issues/449019
      enabled: false,
    },
  ];

  const newPackageRules = Object.entries(gems).flatMap(([name, def]) => {
    const { groupLabel, owners } = def;

    const existingPackageRule = packageRules.findIndex((rule = {}) => {
      const { matchPackageNames, matchPackagePatterns = [] } = rule;

      if (matchPackageNames?.includes?.(name)) {
        return true;
      }

      if (Array.isArray(matchPackagePatterns)) {
        return matchPackagePatterns.some((pattern) => {
          return new RegExp(pattern).test(name);
        });
      }

      return false;
    });

    if (existingPackageRule >= 0) {
      let mutated;
      if (owners.length) {
        console.warn(
          `gem: ${name} already has a rule, adding ${owners.join(
            ", "
          )} as reviewers.`
        );
        packageRules[existingPackageRule].reviewers = concatUnique(
          packageRules[existingPackageRule].reviewers ?? [],
          owners
        );
        mutated = true;
      }

      if (groupLabel) {
        console.warn(
          `gem: ${name} already has a rule, adding ${groupLabel} to MR.`
        );
        packageRules[existingPackageRule].addLabels = concatUnique(
          packageRules[existingPackageRule].addLabels ?? [],
          groupLabel
        );
        mutated = true;
      }
      if (!mutated) {
        console.warn(`gem: ${name} already has a rule. skipping.`);
      }

      return [];
    }

    return {
      matchPackageNames: [name],
      enabled: true,
      // Fall back to engineering productivity
      reviewers: owners.length > 0 ? owners : epBaseConfig.reviewers,
      // If we have a group label, add it
      addLabels: groupLabel ? [groupLabel] : [],
      groupName: name,
    };
  });

  gemConfig = createServerConfig(
    [
      {
        repository: GITLAB_REPO,
        dependencyDashboardTitle: "Dependency Dashboard (ruby)",
        ...baseConfig,
        ...epBaseConfig,
        prConcurrentLimit: 30,
        branchPrefix: "renovate-gems/",
        enabledManagers: ["bundler"],
        semanticCommits: "disabled",
        rangeStrategy: "update-lockfile",
        postUpdateOptions: ["bundlerConservative"],
        postUpgradeTasks: {
          commands: [
            "/workdir/renovate/gitlab/bundle-checksum.sh", // Regenerate files that may change due to the dependency updates.
            "/workdir/renovate/gitlab/bundle-install-next.sh", // Generate lock and checksum files for Gemfile.next.
          ],
          fileFilters: ["Gemfile.checksum", "Gemfile.next.lock", "Gemfile.next.checksum"],
        },
        packageRules: [updateNothing, ...packageRules, ...newPackageRules],
      },
    ],
    {
      allowedPostUpgradeCommands: [
        "^/workdir/renovate/gitlab/bundle-checksum.sh$", // Allow to regenerate Gemfile.checksum.
        "^/workdir/renovate/gitlab/bundle-install-next.sh$", // Allow to regenerate Gemfile.next.lock and Gemfile.next.checksum.
      ],
    }
  );

  return gemConfig;
};
