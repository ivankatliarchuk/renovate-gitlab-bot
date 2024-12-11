const {
  createServerConfig,
  baseConfig,
  defaultLabels,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");
const fs = require("fs");
const path = require("path");

module.exports = createServerConfig(
  [
    {
      repository: "gitlab-renovate-forks/api-client-go",
      ...baseConfig,
      labels: [
        ...defaultLabels,
      ],
      rangeStrategy: "bump",
      semanticCommits: "disabled",
      enabledManagers: ["gitlabci", "gomod"],
      reviewers: ["PatrickRice", "timofurrer"],
      reviewersSampleSize: 2,
      packageRules: [
        {
          // This is our basic rule for Go packages.
          matchManagers: ["gomod"],
          enabled: true,
          commitMessagePrefix: "go:",
          postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
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
      ],
      ...updateDangerReviewComponent,
    },
  ],
  {
    renovateMetaCommentTemplate:
      fs.readFileSync(
        path.join(__dirname, "..", "comment_templates", "default.md"),
        "utf-8"
      ),
  }
);
