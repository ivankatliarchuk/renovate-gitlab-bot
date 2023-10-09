const {
  createServerConfig,
  baseConfig,
  defaultLabels,
} = require("../lib/shared");
const { updateNodeJS } = require("../lib/languages");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-docs",
    ...baseConfig,
    labels: [...defaultLabels, "Technical Writing", "Category:Docs Site"],
    reviewers: ["eread", "marcel.amirault", "sarahgerman"],
    reviewersSampleSize: 3,
    enabledManagers: ["npm", "bundler", "asdf", "nvm"],
    prConcurrentLimit: 4,
    semanticCommits: "disabled",
    packageRules: [
      ...updateNodeJS.packageRules,
      {
        matchPackagePatterns: ["bootstrap", "glob", "vue"],
        enabled: false,
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
