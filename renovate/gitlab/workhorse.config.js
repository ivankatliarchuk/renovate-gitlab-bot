const { createServerConfig, updateNothing, baseConfig } = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab",
    ...baseConfig,
    dependencyDashboardTitle: "Dependency Dashboard (workhorse)",
    labels: [
      "workhorse",
      "section::dev",
      "type::maintenance",
      "maintenance::dependency",
    ],
    branchPrefix: "renovate-workhorse/",
    rangeStrategy: "bump",
    semanticCommits: "disabled",
    stabilityDays: 7,
    prCreation: "not-pending",
    enabledManagers: ["gomod"],
    includePaths: ["workhorse/*"],
    postUpdateOptions: ["gomodTidy"],
    packageRules: [
      updateNothing,
      {
        // This is our basic rule for Go packages.
        matchManagers: ["gomod"],
        enabled: true,
        assignees: ["@stanhu"],
        assigneesSampleSize: 1,
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
        assigneesSampleSize: 2,
        groupName: "gRPC dependencies",
      },
    ],
  },
]);
