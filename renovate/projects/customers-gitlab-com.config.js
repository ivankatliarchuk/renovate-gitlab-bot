const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
  updateNothing,
} = require("../lib/shared");
const { prGitLabScopeAndLinters } = require("../lib/npm");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/customers-gitlab-com",
    ...baseConfig,
    labels: [...defaultLabels, "section::fulfillment", "devops::fulfillment"],
    reviewersSampleSize: 1,
    reviewers: availableRouletteReviewerByRole("customers-app", [
      "maintainer frontend",
    ]),
    semanticCommits: "disabled",
    enabledManagers: ["npm", "bundler", "custom.regex"],
    ...updateDangerReviewComponent,
    packageRules: [
      updateNothing,
      ...prGitLabScopeAndLinters,
      {
        schedule: ["before 05:00 on Monday"],
        matchPackagePatterns: [".+"],
        rangeStrategy: "bump",
        matchManagers: ["bundler"],
        groupName: "Ruby dependencies",
        reviewers: availableRouletteReviewerByRole("customers-app", [
          "reviewer backend",
        ]),
      },
      {
        matchPackageNames: [
          "capybara",
          "capybara-screenshot",
          "factory_bot_rails",
          "launchy",
          "rspec-parameterized",
          "rspec-rails",
          "selenium-webdriver",
          "selenium-devtools",
          "shoulda-matchers",
          "simplecov",
          "test-prof",
          "webdrivers",
          "webmock",
        ],
        enabled: true,
        groupName: "Testing gems",
      },
      {
        matchPackageNames: [
          "amazing_print",
          "debug",
          "lefthook",
          "letter_opener_web",
          "listen",
          "rack-mini-profiler",
          "rails-erd",
          "ruby-lsp-rspec",
        ],
        enabled: true,
        groupName: "Development gems",
      },
    ],
  },
]);
