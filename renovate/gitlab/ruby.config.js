const {
  createServerConfig,
  updateNothing,
  baseConfig,
  epBaseConfig,
  GITLAB_REPO,
} = require("../lib/shared");

module.exports = createServerConfig(
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
      packageRules: [
        updateNothing,
        {
          matchPackageNames: [
            "better_errors",
            "brakeman",
            "danger",
            "lefthook",
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
            "gitlab_quality-test_tooling",
            "rspec-retry",
            "rspec_profiling",
            "rspec-benchmark",
            "rspec-parameterized",
            "selenium-webdriver",
            "test-prof",
            "webmock",
          ],
          enabled: true,
          groupName: "Testing gems",
        },
        {
          matchPackageNames: ["gitlab-dangerfiles"],
          enabled: true,
          groupName: "Tooling gems",
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
          matchPackageNames: ["pg", "pg_query", "marginalia"],
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
          matchPackageNames: [
            "puma",
          ],
          enabled: true,
          groupName: "Puma"
        },
        {
          matchPackageNames: ["prometheus-client-mmap"],
          enabled: true,
          reviewers: ["stanhu", "wchandler"],
          groupName: "prometheus-client-mmap"
        },
      ],
    },
  ],
  {
    allowedPostUpgradeCommands: [
      "^/workdir/renovate/gitlab/bundle-checksum.sh$", // Allow to regenerate Gemfile.checksum.
    ],
  }
);
