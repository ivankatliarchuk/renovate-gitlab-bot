const {
  createServerConfig,
  baseConfig,
  availableRouletteReviewerByRole,
  GITLAB_REPO,
} = require("../lib/shared");

const baseLabels = [
  "type::maintenance",
  "maintenance::dependency",
  "ci::templates",
];

const groupEnvironmentsLabels = [
  ...baseLabels,
  "group::environments",
  "devops::deploy",
  "section::cd",
];

// Data from the team.yml.
const ciTemplateMaintainers = availableRouletteReviewerByRole("gitlab", [
  "maintainer ci_template",
]);

const autoBuildImageReviewers = availableRouletteReviewerByRole("auto-build-image", [
  "reviewer",
  "trainee_maintainer",
  "maintainer",
]);

const autoDeployImageReviewers = availableRouletteReviewerByRole("auto-deploy-image", [
  "reviewer",
  "trainee_maintainer",
  "maintainer",
]);


module.exports = createServerConfig([
  {
    repository: GITLAB_REPO,
    dependencyDashboardTitle: "Dependency Dashboard (CI templates)",
    ...baseConfig,
    branchPrefix: "renovate-ci-templates/",
    enabledManagers: ["regex"],
    semanticCommits: "disabled",
    reviewers: ciTemplateMaintainers,
    labels: baseLabels,
    includePaths: ["lib/gitlab/ci/templates/**/*"],
    commitBody: "Changelog: changed",
    packageRules: [
      {
        groupName: "auto-build-image labels and reviewers",
        matchPackageNames: ["auto-build-image"],
        reviewers: autoBuildImageReviewers,
        labels: groupEnvironmentsLabels,
      },
      {
        groupName: "auto-deploy-image labels and reviewers",
        matchPackageNames: ["auto-deploy-image"],
        reviewers: autoDeployImageReviewers,
        labels: groupEnvironmentsLabels,
      },
      {
        groupName: "major version updates are breaking changes",
        matchUpdateTypes: ["major"],
        addLabels: ["breaking change"],
      },
    ],
    regexManagers: [
      // auto-build-image
      {
        enabled: true,
        fileMatch: [
          "lib/gitlab/ci/templates/Jobs/Build.gitlab-ci.yml",
          "lib/gitlab/ci/templates/Jobs/Build.latest.gitlab-ci.yml",
        ],
        matchStrings: ["AUTO_BUILD_IMAGE_VERSION: '(?<currentValue>.*)'\n"],
        datasourceTemplate: "gitlab-releases", // although it is a docker image, use gitlab-releases so we get richer information in the MR
        registryUrlTemplate: "https://gitlab.com",
        packageNameTemplate: "gitlab-org/cluster-integration/auto-build-image",
        depNameTemplate: "auto-build-image",
      },
      // auto-deploy-image
      {
        enabled: true,
        fileMatch: [
          "lib/gitlab/ci/templates/Jobs/Deploy.gitlab-ci.yml",
          "lib/gitlab/ci/templates/Jobs/Deploy.latest.gitlab-ci.yml",
          "lib/gitlab/ci/templates/Jobs/DAST-Default-Branch-Deploy.gitlab-ci.yml",
        ],
        matchStrings: [
          "AUTO_DEPLOY_IMAGE_VERSION: '(?<currentValue>.*)'\n", // matches DAST_AUTO_DEPLOY_IMAGE_VERSION AND AUTO_DEPLOY_IMAGE_VERSION
        ],
        datasourceTemplate: "gitlab-releases", // although it is a docker image, use gitlab-releases so we get richer information in the MR
        registryUrlTemplate: "https://gitlab.com",
        packageNameTemplate: "gitlab-org/cluster-integration/auto-deploy-image",
        depNameTemplate: "auto-deploy-image",
      },
    ],
  },
]);
