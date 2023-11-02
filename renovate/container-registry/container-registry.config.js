const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig(
  [
    {
      repository: "gitlab-renovate-forks/container-registry",
      ...baseConfig,
      reviewers: availableRouletteReviewerByRole("container-registry"),
      reviewersSampleSize: 1,
      labels: [
        ...defaultLabels,
        "group::container registry",
        "devops::package",
        "section::ci",
        "Category:Container Registry",
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
      packageRules: [
        {
          "matchPackageNames": ["github.com/aws/aws-sdk-go"],
          "schedule": ["before 4am on the first day of the month"],
        },
      ],
    }
  ]
);
