const {
  createServerConfig,
  updateNothing,
  baseConfig,
  defaultLabels,
} = require("../shared");

module.exports = createServerConfig(
  [
    {
      repository: "gitlab-renovate-forks/terraform-provider-gitlab",
      ...baseConfig,
      labels: [
        ...defaultLabels,
        "group::configure",
        "devops::configure",
        "section::ops",
        "Category:Infrastructure as Code",
      ],
      rangeStrategy: "bump",
      semanticCommits: "disabled",
      enabledManagers: ["gomod"],
      postUpdateOptions: ["gomodTidy"],
      packageRules: [
        updateNothing,
        {
          // This is our basic rule for Go packages.
          matchManagers: ["gomod"],
          enabled: true,
          reviewers: [
            "timofurrer",
            "patrickrice",
          ],
          reviewersSampleSize: 2,
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
          // Gitaly's build tooling follows the same review process as normal
          // dependency updates, but we want to change the prefix to make these
          // stand out.
          matchManagers: ["gomod"],
          matchPaths: ["tools/"],
          commitMessagePrefix: "tools/{{parentDir}}:",
          // In order to not have conflicting branches in case the same
          // dependency gets updated in multiple modules we use a branch-prefix
          // here that diambiguates all updates.
          branchPrefix: "renovate-tools/",
          additionalBranchPrefix: "{{parentDir}}/",
        },
      ],
    },
  ],
);
