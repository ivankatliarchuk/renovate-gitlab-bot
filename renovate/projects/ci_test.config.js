const {
  createServerConfig,
  baseConfig,
  epBaseConfig,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/ci_test",
    ...baseConfig,
    ...epBaseConfig,
    enabledManagers: ["bundler", "custom.regex"],
    postUpdateOptions: ["bundlerConservative"],
    semanticCommits: "disabled",
    packageRules: [
      {
        schedule: ["before 05:00 on Monday"],
        matchPackagePatterns: [".+"],
        rangeStrategy: "bump",
        matchManagers: ["bundler"],
        groupName: "Ruby dependencies",
      },
    ],
    ...updateDangerReviewComponent,
  },
]);
