const fs = require("fs");
const path = require("path");
const {
  createServerConfig,
  defaultLabels,
  baseConfig,
  GITLAB_REPO,
} = require("../lib/shared");

const groupEnvironmentsLabels = [
  ...defaultLabels,
  "group::environments",
  "devops::deploy",
  "section::cd",
  "KAS",
];

module.exports = createServerConfig([
  {
    repository: GITLAB_REPO,
    dependencyDashboardTitle: "Dependency Dashboard (Version Files)",
    ...baseConfig,
    branchPrefix: "renovate-vfiles/",
    enabledManagers: ["regex"],
    semanticCommits: "disabled",
    reviewers: ["ash2k", "timofurrer"],
    reviewersSampleSize: 2,
    labels: groupEnvironmentsLabels,
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
    customManagers: [
      // GitLab KAS version
      {
        customType: "regex",
        fileMatch: ["GITLAB_KAS_VERSION"],
        matchStrings: ["(?<currentValue>.*)\\n"],
        datasourceTemplate: "gitlab-releases", // although it is a docker image, use gitlab-releases so we get richer information in the MR
        registryUrlTemplate: "https://gitlab.com",
        depNameTemplate: "kas", // Shorter commit message and MR title
        packageNameTemplate: "gitlab-org/cluster-integration/gitlab-agent",
        /*
        This usually defaults to semver-coerced which drops pre-release versions
        which we commonly use. So we force the more strict `semver` versioning
         */
        versioningTemplate: "semver",
      },
    ],
  },
]);
