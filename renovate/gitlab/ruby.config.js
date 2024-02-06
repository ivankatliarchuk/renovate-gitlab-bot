const {
  createServerConfig,
  updateNothing,
  baseConfig,
  epBaseConfig,
  GITLAB_REPO,
} = require("../lib/shared");
const { getGemReviewers } = require("../lib/reviewers");

module.exports = async function () {
  const gems = await getGemReviewers(
    "https://gitlab.com/gitlab-org/gitlab/-/raw/master/Gemfile",
    "gitlab"
  );

  console.warn("Uh lalala, we have reviewers");
  console.warn(JSON.stringify(gems, null, 2));

  const packageRules = [
    updateNothing,
    {
      matchPackageNames: [
        "better_errors",
        "brakeman",
        "danger",
        "haml_lint",
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
  ];

  const newPackageRules = Object.entries(gems).map(([name, def]) => {
    return {
      matchPacakgeNames: [name],
      enabled: true,
      reviewers: def.owners.length > 0 ? def.owners : undefined,
      groupName: name
    }
  });

  console.warn("Uh lalala, we have newPackageRules");
  console.warn(JSON.stringify(newPackageRules, null, 2));

  packageRules.concat(newPackageRules);

  gemConfig = createServerConfig(
    [
      {
        repository: GITLAB_REPO,
        dependencyDashboardTitle: "Dependency Dashboard (ruby)",
        ...baseConfig,
        ...epBaseConfig,
        branchPrefix: "renovate-gems/",
        enabledManagers: ["bundler"],
        semanticCommits: "disabled",
        rangeStrategy: "bump",
        postUpdateOptions: ["bundlerConservative"],
        postUpgradeTasks: {
          // Regenerate files that may change due to the dependency updates.
          commands: ["/workdir/renovate/gitlab/bundle-checksum.sh"],
          fileFilters: ["Gemfile.checksum"],
        },
        packageRules: packageRules,
      },
    ],
    {
      allowedPostUpgradeCommands: [
        "^/workdir/renovate/gitlab/bundle-checksum.sh$", // Allow to regenerate Gemfile.checksum.
      ],
    }
  );

  return gemConfig;
};
