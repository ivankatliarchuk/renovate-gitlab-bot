const {
  createServerConfig,
  baseConfig,
  distributionLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-operator",
    ...baseConfig,
    semanticCommits: "disabled",
    reviewers: availableRouletteReviewerByRole("gitlab-operator", [
      "reviewer",
      "trainee_maintainer",
    ]),
    reviewersSampleSize: 1,
    labels: distributionLabels,
    commitBody: "Changelog: changed",
    enabledManagers: [
      "gomod",
      "custom.regex", // used by danger component
      "dockerfile",
    ],
    ...updateDangerReviewComponent,
    constraints: {
      "go": "1.23",
    },
    ignoreDeps: [
      "helm.sh/helm/v3", // Helm version needs to stay in sync with GitLab chart helm version
    ],
    docker: {
      pinDigests: true,
    },
    packageRules: [
      {
        matchManager: ["dockerfile"],
        ignoreDeps: [ "golang" ], // Golang version is managed in .gitlab-ci.yml.
      },
      {
        // At the moment we have too many indirect dependencies which would
        // need updating, therefore we disable them (for now)
        matchManagers: ["gomod"],
        matchDepTypes: ["indirect"],
        enabled: false,
      },
      {
        matchManagers: ["gomod"],
        postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
        commitMessageTopic: "{{{replace 'github.com\\/prometheus-operator\\/prometheus-operator\\/pkg\\/apis' 'prom-op-api' depName}}}",
      },
      {
        matchPackagePatterns: [".*k8s.io\/.*"],
        groupName: "k8s.io dependencies"
      },
      {
        matchPackagePatterns: ["github.com\/onsi\/.*"],
        groupName: "testing dependencies"
      },
    ],
  },
]);
