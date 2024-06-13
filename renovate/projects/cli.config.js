const { updateNodeJS } = require("../lib/languages");
const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/cli",
    ...baseConfig,
    reviewers: availableRouletteReviewerByRole("gitlab-cli"),
    reviewersSampleSize: 1,
    labels: [
      ...defaultLabels,
      "group::code review",
      "devops::create",
      "section::dev",
      "Category:GitLab CLI",
      "type::maintenance",
    ],
    rangeStrategy: "bump",
    includePaths: ["*", "scripts/commit-lint/*"],
    enabledManagers: ["asdf", "custom.regex", "gomod", "npm"],
    postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
    packageRules: [
      {
        // We want updates to golang, but not vale in asdf
        matchManagers: ["asdf"],
        matchPackageNames: ["vale"],
        enabled: false,
      },
      {
        // Group golang updates across asdf, gomod and GitLab CI
        matchManagers: ["asdf", "gomod", "custom.regex"],
        matchPackageNames: ["golang", "go"],
        groupName: "golang",
      },
    ],
    customManagers: [
      {
        customType: "regex",
        fileMatch: ["^.gitlab-ci.yml"],
        matchStrings: ["GO_VERSION: [\"'](?<currentValue>.*?)[\"']"],
        depNameTemplate: "golang",
        datasourceTemplate: "github-tags",
        packageNameTemplate: "golang/go",
        extractVersionTemplate: "^go(?<version>\\S+)",
      },
      ...updateDangerReviewComponent.customManagers,
    ],
    dependencyDashboard: false,
  },
]);
