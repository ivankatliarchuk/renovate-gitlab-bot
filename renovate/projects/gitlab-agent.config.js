const { createServerConfig, defaultLabels, baseConfig } = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-agent",
    ...baseConfig,
    reviewers: ["tigerwnz", "ash2k", "timofurrer"],
    labels: [
      ...defaultLabels,
      "group::configure",
      "devops::configure",
      "section::ops",
    ],
    postUpdateOptions: [],
    enabledManagers: ["regex"],
    regexManagers: [
      {
        fileMatch: [".gitlab/.gitlab-ci.yml"],
        matchStrings: [
          "\n\\s*BUILD_IMAGE_SHA:\\s*\"(?<currentValue>[^@]+)@(?<currentDigest>sha256:[a-f0-9]+)\"\n",
        ],
        depNameTemplate: "gitlab-agent-ci-image",
        packageNameTemplate: "gitlab/gitlab-agent-ci-image",
        datasourceTemplate: "docker",
      },
      {
        fileMatch: [".gitlab/.gitlab-ci.yml"],
        matchStrings: [
          "\n\\s*FIPS_BUILD_IMAGE_SHA:\\s*\"(?<currentValue>[^@]+)@(?<currentDigest>sha256:[a-f0-9]+)\"\n",
        ],
        depNameTemplate: "gitlab-agent-ci-image",
        packageNameTemplate: "gitlab/gitlab-agent-ci-image",
        datasourceTemplate: "docker",
      },
      {
        fileMatch: [".gitlab/.gitlab-ci.yml"],
        matchStrings: [
          "\n\\s*DOCKER_VERSION:\\s*\"(?<currentValue>[^\"]+)\"\n",
        ],
        depNameTemplate: "docker",
        datasourceTemplate: "docker",
      },
      {
        fileMatch: ["WORKSPACE"],
        matchStrings: [
          "\n#\\s*(?<currentValue>\\S+)\\s+from.*?\n" +
          "\\s*container_pull(\n" +
          "\\s*name\\s*=\\s*\"[^\"]\",\n" +
          "\\s*digest\\s*=\\s*\"(?<currentDigest>sha256:[a-f0-9]+)\",\n" +
          "\\s*registry\\s*=\\s*\"(?<registry>[^\"]+)\",\n" +
          "\\s*repository\\s*=\\s*\"(?<repository>[^\"]+)\",\n" +
          "\\s*)",
        ],
        depNameTemplate: "{{{registry}}}/{{{repository}}}",
        datasourceTemplate: "docker",
      }
    ]
  }
]);
