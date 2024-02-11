const { readFileSync } = require('fs');
const { join } = require('path');

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
    reviewersSampleSize: 1,
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
],
{
  renovateMetaCommentTemplate: readFileSync(
    join(
      __dirname,
      "..",
      "comment_templates",
      "product_analytics_devkit.md"
    ),
    "utf-8"
  ),
});
