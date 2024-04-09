const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig(
  [
    {
      repository: "gitlab-renovate-forks/gitaly",
      ...baseConfig,
      reviewers: availableRouletteReviewerByRole("gitaly"),
      reviewersSampleSize: 2,
      labels: [
        ...defaultLabels,
        "group::gitaly",
        "devops::systems",
        "section::enablement",
        "Category:Gitaly",
      ],
      rangeStrategy: "bump",
      internalChecksFilter: "strict",
      semanticCommits: "disabled",
      minimumReleaseAge: "7 days",
      prCreation: "immediate",
      enabledManagers: ["gomod", "regex"],
      includePaths: [
        // The main Gitaly module that tracks versions for all of our installed
        // binaries.
        "*",
        // The directory containing build tools.
        "tools/**",
      ],
      postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
      postUpgradeTasks: {
        // Regenerate files that may change due to the dependency updates.
        commands: ["make notice"],
        fileFilters: ["NOTICE"],
      },
      packageRules: [
        {
          // This is our basic rule for Go packages.
          matchManagers: ["gomod"],
          enabled: true,
          commitMessagePrefix: "go:",
        },
        {
          // Gitaly's build tooling follows the same review process as normal
          // dependency updates, but we want to change the prefix to make these
          // stand out.
          matchManagers: ["gomod"],
          matchPaths: ["tools/**"],
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
          enabled: false,
        },
        {
          // At the moment we have too many indirect dependencies which would
          // need updating, therefore we disable them (for now)
          matchManagers: ["gomod"],
          matchDepTypes: ["indirect"],
          enabled: false,
        },
        // Git version is specified in the Makefile and we only want to
        // update patch releases
        {
          matchManagers: ["regex"],
          matchPackageNames: ["git/git"],
          separateMinorPatch: true,
        },
        {
          matchManagers: ["regex"],
          matchPackageNames: ["git/git"],
          matchUpdateTypes: ["major", "minor"],
          enabled: false,
        },
      ],
      regexManagers: [
        {
          fileMatch: ["^Makefile$"],
          matchStrings: ["GIT_VERSION_\\d+_\\d+ \\?= (?<currentValue>.*)"],
          datasourceTemplate: "github-tags",
          depNameTemplate: "git",
          packageNameTemplate: "git/git",
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
