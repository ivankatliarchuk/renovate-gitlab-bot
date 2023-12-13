const {
  createServerConfig,
  updateNothing,
  baseConfig,
  defaultLabels,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-docs",
    ...baseConfig,
    labels: [...defaultLabels, "Technical Writing", "Category:Docs Site"],
    reviewers: ["eread", "marcel.amirault", "sarahgerman"],
    reviewersSampleSize: 3,
    enabledManagers: ["npm", "bundler"],
    prConcurrentLimit: 4,
    semanticCommits: "disabled",
    packageRules: [
      updateNothing,
      {
        groupName: "Frontend dependencies",
        matchPackagePatterns: [
          "@gitlab/fonts",
          "@gitlab/svgs",
          "@gitlab/ui",
          "mermaid",
        ],
        enabled: true,
      },
      {
        groupName: "Backend dependencies",
        matchPackagePatterns: ["gitlab-dangerfiles", "nanoc"],
        enabled: true,
      },
      {
        schedule: ["before 05:00 on Monday"],
        matchPackagePatterns: [".+"],
        rangeStrategy: "bump",
        matchManagers: ["bundler"],
        groupName: "Ruby dependencies",
      },
      {
        schedule: ["before 05:00 on Monday"],
        matchPackagePatterns: [".+"],
        rangeStrategy: "bump",
        matchManagers: ["npm"],
        groupName: "NodeJS dependencies",
      },
    ],
  },
]);
