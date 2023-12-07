const {
  createServerConfig,
  availableRouletteReviewerByRole,
  baseConfig,
  defaultLabels,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/version.gitlab.com",
    ...baseConfig,
    labels: [
      ...defaultLabels,
      "devops::monitor",
      "section::analytics",
      "group::analytics instrumentation",
    ],
    reviewers: availableRouletteReviewerByRole(
      "version.gitlab.com",
      "maintainer backend"
    ),
    reviewersSampleSize: 1,
    semanticCommits: "disabled",
    rangeStrategy: "auto",
    separateMultipleMajor: true,
    minimumReleaseAge: "3 days",
    prConcurrentLimit: 5,
    enabledManagers: ["bundler"],
    packageRules: [
      {
        matchPackagePatterns: [".+"],
        matchManagers: ["bundler"],
        extends: ["schedule:weekly"],
      },
      {
        matchPackageNames: [
          "puma",
          "webmock",
          "shoulda-matchers",
          "rspec-parameterized",
          "selenium-webdriver",
          "webdrivers",
          "capybara",
          "capybara-screenshot",
          "test-prof",
          "rspec-rails",
          "minitest",
          "launchy",
          "faker",
          "simplecov",
          "factory_bot_rails",
          "execjs",
          "timecop",
        ],
        enabled: true,
        groupName: "Testing gems",
      },
    ],
  },
]);
