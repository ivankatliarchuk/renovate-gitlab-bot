const {
  createServerConfig,
  defaultLabels,
  baseConfig,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-agent-ci-image",
    ...baseConfig,
    // See pending MR for project entry: https://gitlab.com/gitlab-com/www-gitlab-com/-/merge_requests/127174
    // reviewers: availableRouletteReviewerByRole("gitlab-agent-ci-image")
    reviewers: ["timofurrer", "ash2k"],
    labels: [
      ...defaultLabels,
      "group::environments",
      "devops::deploy",
      "section::cd",
    ],
    enabledManagers: ["gitlabci", "custom.regex"],
    packageRules: [
      {
        matchPackageNames: ["docker"],
        matchDatasources: ["docker"],
        matchManagers: ["custom.regex"],
        customChangelogUrl: "https://github.com/moby/moby",
      },
    ],
    customManagers: [
      {
        customType: "regex",
        fileMatch: ["^.gitlab-ci.yml$"],
        matchStrings: ['\n\\s*DOCKER_VERSION:\\s*"(?<currentValue>[^"]+)"'],
        datasourceTemplate: "docker",
      },
      {
        customType: "regex",
        fileMatch: ["Dockerfile$"],
        matchStrings: ["ARG GO_VERSION=(?<currentValue>.*?)\\n"],
        datasourceTemplate: "golang-version",
      },
      {
        customType: "regex",
        fileMatch: ["Dockerfile$"],
        matchStrings: ["ARG BAZELISK_VERSION=(?<currentValue>.*?)\\n"],
        depNameTemplate: "bazelbuild/bazelisk",
        datasourceTemplate: "github-releases",
      },
    ],
  },
]);
