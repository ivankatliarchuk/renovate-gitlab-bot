const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-pages",
    ...baseConfig,
    labels: [
      ...defaultLabels,
      "section::dev",
      "devops::plan",
      "group::knowledge",
      "Category:Pages",
      "backend",
      "golang"
    ],
    reviewers: availableRouletteReviewerByRole("gitlab-pages"),
    reviewersSampleSize: 1,
    enabledManagers: ["asdf", "gomod", "custom.regex"],
    ...updateDangerReviewComponent,
    prConcurrentLimit: 4,
    semanticCommits: "disabled",
    packageRules: [],
    postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
  },
]);
