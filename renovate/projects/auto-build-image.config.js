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
    semanticCommits: "enabled",
    semanticCommitType: "feat",
    reviewers: availableRouletteReviewerByRole("auto-build-image"),
    labels: [
      ...defaultLabels,
      "group::environments",
    ],
    enabledManagers: ["regex", "npm"],
    regexManagers: [
      {
        enabled: true,
        fileMatch: [".gitlab-ci.yml"],
        matchStrings: ["PACK_VERSION: (?<currentValue>.*)\n"],
        depNameTemplate: "pack",
        packageNameTemplate: "buildpacks/pack",
        datasourceTemplate: "github-tags",
      },
      {
        enabled: true,
        fileMatch: [".gitlab-ci.yml"],
        matchStrings: ["DOCKER_VERSION: (?<currentValue>.*)\n"],
        depNameTemplate: "docker",
        datasourceTemplate: "docker",
      },
      {
        enabled: true,
        fileMatch: [".gitlab-ci.yml"],
        matchStrings: ["BUILDX_VERSION: (?<currentValue>.*)\n"],
        depNameTemplate: "buildx",
        packageNameTemplate: "docker/buildx",
        datasourceTemplate: "github-tags",
      },
    ],
  },
]);
