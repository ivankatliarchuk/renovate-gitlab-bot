const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab",
    ...baseConfig,
    reviewers: availableRouletteReviewerByRole(
      "gitlab",
      "maintainer workhorse"
    ),
    reviewersSampleSize: 1,
    dependencyDashboardTitle: "Dependency Dashboard (workhorse)",
    labels: [...defaultLabels, "workhorse", "section::dev"],
    branchPrefix: "renovate-workhorse/",
    rangeStrategy: "bump",
    semanticCommits: "disabled",
    stabilityDays: 7,
    prCreation: "not-pending",
    enabledManagers: ["gomod"],
    includePaths: ["workhorse/*"],
    postUpdateOptions: ["gomodTidy"],
    packageRules: [
      {
        // This is our basic rule for Go packages.
        matchManagers: ["gomod"],
        enabled: true,
        commitMessagePrefix: "workhorse:",
      },
      {
        // golang.org/x/ packages don't use releases, but instead use a
        // master-based development workflow. We don't want to upgrade on
        // every new commit though to avoid needless churn, so we just make
        // sure to update once per month.
        matchManagers: ["gomod"],
        matchPackagePrefixes: ["golang.org/x/"],
        schedule: ["on the first day of the month"],
      },
      {
        matchManagers: ["gomod"],
        matchPackagePrefixes: [
          "github.com/grpc-ecosystem/",
          "google.golang.org/",
        ],
        groupName: "gRPC dependencies",
      },
      {
        // At the moment we have too many indirect dependencies which would
        // need updating, therefore we disable them (for now)
        matchManagers: ["gomod"],
        matchDepTypes: ["indirect"],
        enabled: false,
      },
    ],
  },
]);
