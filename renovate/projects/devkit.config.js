const {
  createServerConfig,
  baseConfig,
  defaultLabels,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository:
      "gitlab-renovate-forks/devkit",
    ...baseConfig,
    reviewers: ["elwyn-gitlab", "halilcoban", "jiaan", "mwoolf", "rob.hunt"],
    labels: [
      ...defaultLabels,
      "devops::monitor",
      "section::analytics",
      "group::product-analytics",
    ],
    internalChecksFilter: "strict",
    separateMultipleMajor: true,
    minimumReleaseAge: "3 days",
    rangeStrategy: "auto",
    semanticCommits: "enabled",
    enabledManagers: ["docker-compose"],
    packageRules: [
      {
        matchPackagePatterns: [".+"],
        matchManagers: ["docker-compose"],
        extends: ["schedule:weekly"],
      },
    ],
  },
]);
