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
      postUpgradeTasks: {
        // Regenerate files that may change due to the dependency updates.
        commands: ["terraform providers lock -platform=darwin_arm64 -platform=linux_amd64"],
        fileFilters: ["*/.terraform.lock.hcl"],
      },
      packageRules: [
        // Default rules that can be overridden by the next packageRules
        //
        // See https://docs.renovatebot.com/configuration-options/#packagerules for more info
        {
          enabled: true,
          matchPaths: ["**/*"],
        },
        {
          matchPaths: ["qa-resources/modules/triage-reactive/**/*"],
          reviewers: epBaseConfig.reviewers,
        },
        {
          matchPaths: ["qa-resources/modules/e2e-ci/**/*"],
          reviewers: ["acunskis"],
        },
        {
          matchPaths: ["qa-resources/modules/gitlab-runners/**/*"],
          reviewers: ["acunskis"],
        },
        {
          matchPaths: ["qa-resources/modules/test-metrics/**/*"],
          reviewers: ["acunskis"],
        },
      ],
    },
  ],
  {
    allowedPostUpgradeCommands: ["^terraform providers lock -platform=darwin_arm64 -platform=linux_amd64$"],
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
