const fs = require("fs");
const path = require("path");
const { createServerConfig, defaultLabels, baseConfig } = require("../shared");

const groupConfigureLabels = [
  ...defaultLabels,
  "group::configure",
  "devops::configure",
  "section::ops",
];

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab",
    dependencyDashboardTitle: "Dependency Dashboard (Version Files)",
    ...baseConfig,
    branchPrefix: "renovate-vfiles/",
    enabledManagers: ["regex"],
    semanticCommits: "disabled",
    reviewers: ["ashmckenzie", "tkuah"],
    reviewersSampleSize: 1,
    labels: groupConfigureLabels,
    includePaths: ["GITLAB_KAS_VERSION"],
    postUpdateOptions: [],
    renovateMetaCommentTemplate: fs.readFileSync(
      path.join(__dirname, "..", "comment_templates", "kas.md"),
      "utf-8"
    ),
    /* Allow prereleases for dependencies
     * As we only update kas at the moment, this is fine,
     * but we might want to move this to packageRules,
     * if we renovate more things
     */ 
    ignoreUnstable: false,
    regexManagers: [
      // GitLab KAS version
      {
        fileMatch: ["GITLAB_KAS_VERSION"],
        matchStrings: ["(?<currentValue>.*)\n"],
        datasourceTemplate: "gitlab-releases", // although it is a docker image, use gitlab-releases so we get richer information in the MR
        registryUrlTemplate: "https://gitlab.com",
        depNameTemplate: "kas", // Shorter commit message and MR title
        packageNameTemplate: "gitlab-org/cluster-integration/gitlab-agent",
      },
    ],
  },
]);
