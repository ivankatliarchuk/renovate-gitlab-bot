const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/prometheus-client-mmap",
    ...baseConfig,
    reviewers: availableRouletteReviewerByRole("prometheus-client-mmap"),
    reviewersSampleSize: 1,
    labels: [...defaultLabels, "devops::systems", "section::core platform"],
    rangeStrategy: "bump",
    internalChecksFilter: "strict",
    semanticCommits: "disabled",
    minimumReleaseAge: "7 days",
    prCreation: "immediate",
    enabledManagers: ["cargo"],
    includePaths: [
      // Root directory has a Cargo.toml that contains native extension as
      // a workspace member.
      "*",
      // Actual Cargo.toml is inside ext/fast_mmaped_file_rs
      "ext/fast_mmaped_file_rs/*",
    ],
    packageRules: [
      {
        // This is our basic rule for Rust packages.
        matchManagers: ["cargo"],
        enabled: true,
        commitMessagePrefix: "cargo:",
      },
      {
        // At the moment we have too many indirect dependencies which would
        // need updating, therefore we disable them (for now)
        matchManagers: ["cargo"],
        matchDepTypes: ["indirect"],
        enabled: false,
      },
    ],
  },
]);
