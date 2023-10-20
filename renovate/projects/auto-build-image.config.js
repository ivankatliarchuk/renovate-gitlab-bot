const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/auto-build-image",
    ...baseConfig,
    extends: ["group:commitlintMonorepo"],
    reviewers: availableRouletteReviewerByRole("auto-build-image"),
    labels: [
      ...defaultLabels,
      "group::environments",
    ],
    enabledManagers: ["npm", "regex"],
    packageRules: [
      {
        matchManagers: ["regex"],
        semanticCommitType: "feat",
      },
      {
        matchPackageNames: ["docker"],
        matchDatasources: ["docker"],
        matchManagers: ["regex"],
        customChangelogUrl: "https://github.com/moby/moby",
      },
    ],
    regexManagers: [
      {
        fileMatch: [".gitlab-ci.yml"],
        matchStrings: ["PACK_VERSION: (?<currentValue>.*)\n"],
        depNameTemplate: "pack",
        packageNameTemplate: "buildpacks/pack",
        datasourceTemplate: "github-tags",
      },
      {
        fileMatch: [".gitlab-ci.yml"],
        matchStrings: ["DOCKER_VERSION: (?<currentValue>.*)\n"],
        depNameTemplate: "docker",
        datasourceTemplate: "docker",
      },
      {
        fileMatch: [".gitlab-ci.yml"],
        matchStrings: ["BUILDX_VERSION: (?<currentValue>.*)\n"],
        depNameTemplate: "buildx",
        packageNameTemplate: "docker/buildx",
        datasourceTemplate: "github-tags",
      },
    ],
  },
]);
