const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/opentofu",
    ...baseConfig,
    extends: ["group:commitlintMonorepo"],
    labels: [
      ...defaultLabels,
      "group::environments",
      "Category:Infrastructure as Code",
    ],
    enabledManagers: ["gitlabci", "regex"],
    reviewers: ["timofurrer"],
    packageRules: [
      {
        matchPackageNames: ["docker"],
        matchDatasources: ["docker"],
        matchManagers: ["regex"],
        customChangelogUrl: "https://github.com/moby/moby",
      },
    ],
    regexManagers: [
      {
        fileMatch: ["^.gitlab-ci.yml$"],
        matchStrings: ['BASE_IMAGE: "(?<depName>.*):(?<currentValue>.*)"\\s'],
        datasourceTemplate: "docker",
      },
      {
        fileMatch: ["^.gitlab-ci.yml$"],
        matchStrings: [
          'DOCKER_DIND_IMAGE: "(?<depName>.*):(?<currentValue>.*)-dind"\\s',
        ],
        datasourceTemplate: "docker",
      },
    ],
  },
]);
