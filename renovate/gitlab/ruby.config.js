const { createServerConfig, updateNothing, baseConfig, epBaseConfig } = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab",
    dependencyDashboardTitle: "Dependency Dashboard (ruby)",
    ...baseConfig,
    ...epBaseConfig,
    branchPrefix: "renovate-gems/",
    enabledManagers: ["bundler"],
    semanticCommits: "disabled",
    packageRules: [
      updateNothing,
      {
        matchPackageNames: [
          "better_errors",
          "bootsnap",
          "brakeman",
          "danger",
          "lefthook",
          "letter_opener_web",
          "parser",
          "thin",
        ],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Ruby development dependencies",
      },
      {
        matchPackageNames: ["gitlab-styles", "gitlab-dangerfiles"],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "GitLab Tooling Ruby dependencies",
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
        rangeStrategy: "bump",
        groupName: "Ruby Markdown and HTML parsing dependencies",
      },
      {
        matchPackageNames: ["pg", "pg_query"],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Ruby database dependencies",
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
        rangeStrategy: "bump",
        groupName: "Ruby Rack-related dependencies",
      },
      {
        matchPackageNames: ["aws-sdk-core", "aws-sdk-s3"],
        enabled: true,
        rangeStrategy: "bump",
        groupName: "Ruby AWS-related dependencies",
      },
    ],
  },
]);
