const {
  createServerConfig,
  baseConfig,
  epBaseConfig,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-development-kit",
    ...baseConfig,
    labels: [...epBaseConfig.labels, "Category:GDK"],
    reviewers: availableRouletteReviewerByRole("gitlab-development-kit"),
    reviewersSampleSize: 1,
    enabledManagers: ["npm", "bundler", "custom.regex"],
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
