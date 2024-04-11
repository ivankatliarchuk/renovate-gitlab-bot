const fs = require("fs");
const path = require("path");
const {
  createServerConfig,
  baseConfig,
  epBaseConfig,
} = require("../lib/shared");

module.exports = createServerConfig(
  [
    {
      repository:
        "gitlab-renovate-forks/engineering-productivity-infrastructure",
      ...baseConfig,
      ...epBaseConfig,
      branchPrefix: "renovate-terraform/",
      reviewers: [...epBaseConfig.reviewers, "acunskis"],
      includePaths: ["**/*"],
      enabledManagers: ["terraform"],
      ignoreDeps: ["gitlab-runner"],
      packageRules: [
        // Default rules that can be overridden by the next packageRules
        //
        // See https://docs.renovatebot.com/configuration-options/#packagerules for more info
        {
          enabled: true,
          matchFileNames: ["**/*"],
        },
        {
          matchFileNames: ["qa-resources/modules/triage-reactive/**/*"],
          reviewers: epBaseConfig.reviewers,
        },
        {
          matchFileNames: ["qa-resources/modules/e2e-ci/**/*"],
          reviewers: ["acunskis"],
        },
        {
          matchFileNames: ["qa-resources/modules/gitlab-runners/**/*"],
          reviewers: ["acunskis"],
        },
        {
          matchFileNames: ["qa-resources/modules/test-metrics/**/*"],
          reviewers: ["acunskis"],
        },
      ],
    },
  ],
  {
    renovateMetaCommentTemplate: fs.readFileSync(
      path.join(
        __dirname,
        "..",
        "comment_templates",
        "engineering_productivity_infra.md"
      ),
      "utf-8"
    ),
  }
);
