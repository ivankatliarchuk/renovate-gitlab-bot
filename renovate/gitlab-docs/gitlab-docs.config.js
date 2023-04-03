const { createServerConfig, baseConfig, defaultLabels } = require("../shared");
const { updateNodeJS } = require("../frontend");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-docs",
    ...baseConfig,
    labels: [
      ...defaultLabels,
      "Technical Writing",
      "Category:Docs Site",
    ],
    reviewers: [
      "eread",
      "marcel.amirault",
      "sarahgerman",
    ],
    reviewersSampleSize: 3,
    enabledManagers: ["npm", "bundler", "asdf", "nvm"],
    prConcurrentLimit: 4,
    semanticCommits: "disabled",
    packageRules: [
      ...updateNodeJS.packageRules,
      {
        matchPackagePatterns: ["bootstrap", "vue", "@rollup/plugin-node-resolve", "mermaid"],
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
