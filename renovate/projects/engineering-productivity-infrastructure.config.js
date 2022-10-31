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
        matchManagers: ["terraform"],
      },
    ],
  },
],
{
  renovateMetaCommentTemplate: fs.readFileSync(path.join(__dirname, "..", "comment_templates", "engineering_productivity_infra.md"), "utf-8"),
}
);
