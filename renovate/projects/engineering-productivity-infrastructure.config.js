const fs   = require("fs");
const path = require("path");
const { createServerConfig, baseConfig, epBaseConfig } = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/engineering-productivity-infrastructure",
    ...baseConfig,
    ...epBaseConfig,
    branchPrefix: "renovate-terraform/",
    reviewers: [...epBaseConfig.reviewers, "acunskis"],
    includePaths: ["**/*"],
    enabledManagers: ["terraform"],
    packageRules: [
      {
        enabled: true,
        matchPaths: ["qa-resources/modules/e2e-ci/**/*"],
        groupName: "E2E CI Terraform module",
      },
      {
        enabled: true,
        matchPaths: ["qa-resources/modules/gitlab-runners/**/*"],
        groupName: "GitLab Runners Terraform module",
      },
      {
        enabled: true,
        matchPaths: ["qa-resources/modules/test-metrics/**/*"],
        reviewers: ["acunskis"],
        groupName: "Test Metrics Terraform module",
      },
      {
        enabled: true,
        matchPaths: ["qa-resources/modules/triage-reactive/**/*"],
        reviewers: epBaseConfig.reviewers,
        groupName: "Triage Reactive Terraform module",
      },
      {
        enabled: true,
        matchPaths: ["qa-resources/**/*"],
        groupName: "Default QA Resources update",
      },
      {
        enabled: true,
        matchPaths: ["**/*"],
        groupName: "Non-categorized Terraform files",
      },
    ],
  },
],
{
  renovateMetaCommentTemplate: fs.readFileSync(path.join(__dirname, "..", "comment_templates", "engineering_productivity_infra.md"), "utf-8"),
}
);
