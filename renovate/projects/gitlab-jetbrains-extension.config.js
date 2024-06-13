const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

const enableWithBumpStrategy = {
  rangeStrategy: "bump",
  enabled: true,
};

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-jetbrains-plugin",
    ...baseConfig,
    includePaths: ["*", "webview/*"],
    labels: [
      ...defaultLabels,
      "group::editor extensions",
      "devops::create",
      "section::dev",
      "type::maintenance",
    ],
    semanticCommits: "disabled",
    prConcurrentLimit: 2,
    reviewers: availableRouletteReviewerByRole("gitlab-jetbrains-plugin"),
    reviewersSampleSize: 1,
    enabledManagers: ["npm", "gradle", "custom.regex"],
    packageRules: [
      {
        ...enableWithBumpStrategy,
        matchPackagePrefixes: [
          "com.apollographql.apollo3",
          "io.gitlab.arturbosch.detekt",
          "org.jetbrains.kotlin",
        ],
        excludePackagePrefixes: ["org.jetbrains.kotlinx"],
        groupName: "JetBrains Plugin",
      },
      {
        ...enableWithBumpStrategy,
        matchPackagePrefixes: [
          "org.junit",
          "io.kotest",
          "com.intellij.remoterobot",
        ],
        groupName: "Testing",
      },
      {
        ...enableWithBumpStrategy,
        matchPackagePrefixes: ["io.ktor"],
        groupName: "ktor",
      },
      {
        ...enableWithBumpStrategy,
        matchPackagePrefixes: ["com.fasterxml.jackson"],
        groupName: "jackson",
      },
      {
        ...enableWithBumpStrategy,
        matchPackageNames: [],
        groupName: "Fetch frameworks",
      },
      {
        ...enableWithBumpStrategy,
        matchPackageNames: [],
        groupName: "Linting",
      },
      {
        matchPackageNames: ["@types/node"],
        enabled: false,
      },
    ],
    ...updateDangerReviewComponent,
  },
]);
