const {
  createServerConfig,
  updateNothing,
  baseConfig,
  epBaseConfig,
  GITLAB_REPO,
} = require("../lib/shared");
const { getGemReviewers } = require("../lib/reviewers");

const gemConfig = createServerConfig(
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
            "haml_lint",
            "lefthook",
            "letter_opener_web",
            "parser",
            "thin",
            "ruby-lsp",
            "ruby-lsp-rails",
            "ruby-lsp-rspec",
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
            "gitlab-glfm-markdown",
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
          matchPackageNames: ["puma"],
          enabled: true,
          groupName: "Puma",
        },
        {
          matchPackageNames: ["prometheus-client-mmap"],
          enabled: true,
          reviewers: ["stanhu", "wchandler"],
          groupName: "prometheus-client-mmap",
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

module.exports = async function () {
  const reviewers = await getGemReviewers(
    "https://gitlab.com/gitlab-org/gitlab/-/raw/master/Gemfile",
    "gitlab"
  );

  console.warn("Uh lalala, we have reviewers");
  console.warn(JSON.stringify(reviewers, null, 2));

  return gemConfig;
};
