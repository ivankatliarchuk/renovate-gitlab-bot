const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");
const fs = require("fs");
const path = require("path");

module.exports = createServerConfig(
  [
    {
      repository: "gitlab-renovate-forks/terraform-provider-gitlab",
      ...baseConfig,
      labels: [
        ...defaultLabels,
        "group::environments",
        "devops::deploy",
        "section::cd",
        "Category:Infrastructure as Code",
      ],
      includePaths: [
        // The main module
        "*",
        // The directory containing build tools.
        "tools/**",
      ],
      rangeStrategy: "bump",
      semanticCommits: "disabled",
      enabledManagers: ["gitlabci", "gomod", "custom.regex"],
      reviewers: availableRouletteReviewerByRole("terraform-provider-gitlab"),
      reviewersSampleSize: 2,
      packageRules: [
        {
          // This is our basic rule for Go packages.
          matchManagers: ["gomod"],
          commitMessagePrefix: "go:",
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
          // build tooling follows the same review process as normal dependency
          // updates, but we want to change the prefix to make these stand out.
          matchManagers: ["gomod"],
          matchFileNames: ["tools/**"],
          commitMessagePrefix: "tools/{{parentDir}}:",
          // In order to not have conflicting branches in case the same
          // dependency gets updated in multiple modules we use a branch-prefix
          // here that diambiguates all updates.
          branchPrefix: "renovate-tools/",
          additionalBranchPrefix: "{{parentDir}}/",
        },
        {
          // These roles are moved inside the gomod manager only.  Initially
          // they were defined globally.
          matchManagers: ["gomod"],
          postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
          postUpgradeTasks: {
            // Regenerate files that may change due to the dependency updates.
            commands: ["make reviewable"],
            fileFilters: ["*"],
          },
        },
      ],
      ...updateDangerReviewComponent,
    },
  ],
  {
    allowedPostUpgradeCommands: ["^make reviewable$"],
    renovateMetaCommentTemplate:
      fs.readFileSync(
        path.join(__dirname, "..", "comment_templates", "default.md"),
        "utf-8"
      ) + "\n\n/cc @PatrickRice",
  }
);
