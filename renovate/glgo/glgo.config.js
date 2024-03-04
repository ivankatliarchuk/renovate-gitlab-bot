const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig(
  [
    {
      repository: "gitlab-renovate-forks/glgo",
      ...baseConfig,
      reviewers: ["jdrpereira", "grzesiek"],
      reviewersSampleSize: 1,
      labels: [
        ...defaultLabels,
        "devops::package",
        "section::ci",
        "backend",
        "golang"
      ],
      semanticCommits: "enabled",
      semanticCommitType: "build",
      minimumReleaseAge: 7,
      prCreation: "not-pending",
      prConcurrentLimit: 4,
      enabledManagers: ["gomod"],
      postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
      packageRules: [],
    }
  ]
);
