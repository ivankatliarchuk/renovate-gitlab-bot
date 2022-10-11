const {
  createServerConfig,
  updateNothing,
  baseConfig,
  defaultLabels,
} = require("../shared");

module.exports = createServerConfig(
  [
    {
      repository: "gitlab-renovate-forks/gitaly",
      ...baseConfig,
      labels: [
        ...defaultLabels,
        "group::gitaly",
        "devops::systems",
        "section::enablement",
        "Category:Gitaly",
      ],
      rangeStrategy: "bump",
      semanticCommits: "disabled",
      stabilityDays: 7,
      prCreation: "not-pending",
      enabledManagers: ["bundler", "gomod"],
      includePaths: [
        // The Ruby sidecar.
        "ruby/**",
        // The main Gitaly module that tracks versions for all of our installed
        // binaries.
        "*",
        // The directory containing build tools.
        "tools/**",
      ],
      postUpdateOptions: ["gomodTidy", "bundlerConservative"],
      postUpgradeTasks: {
        // Regenerate files that may change due to the dependency updates.
        commands: ["make notice"],
        fileFilters: ["NOTICE"],
      },
      packageRules: [
        updateNothing,
        {
          matchManagers: ["bundler"],
          matchPackageNames: ["gitlab-labkit"],
          enabled: true,
          reviewers: ["pks-t", "stanhu"],
          commitMessagePrefix: "ruby:",
          groupName: "Ruby dependencies",
        },
        {
          // This is our basic rule for Go packages.
          matchManagers: ["gomod"],
          enabled: true,
          reviewers: [
            "8bitlife",
            "jcaigitlab",
            "justintobler",
            "knayakgl",
            "pks-t",
            "proglottis",
            "qmnguyen0711",
            "samihiltunen",
            "toon",
            "wchandler",
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
        {
          // The Go version cannot easily be upgraded in an automated way as
          // this needs to be coordinated globally across all GitLab
          // components. We thus disable upgrades to the Go language version.
          matchManagers: ["gomod"],
          matchDepTypes: ["golang"],
          enabled: false
        },
      ],
    },
  ],
  {
    allowedPostUpgradeCommands: [
      "^make notice$", // Allow Gitaly generating a new NOTICE file.
    ],
  }
);
