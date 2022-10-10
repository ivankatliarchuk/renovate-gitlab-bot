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
        // Just look in the ruby sub directory
        "ruby/**",
        // and the root directory
        "*",
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
      ],
    },
  ],
  {
    allowedPostUpgradeCommands: [
      "^make notice$", // Allow Gitaly generating a new NOTICE file.
    ],
  }
);
