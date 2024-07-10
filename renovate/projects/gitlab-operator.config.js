const {
  createServerConfig,
  baseConfig,
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
      "maintainer",
    ]),
    reviewersSampleSize: 1,
    labels: [
      "group::distribution",
      "devops::systems",
      "section::core platform",
      "type::maintenance",
      "maintenance::dependency",
      "workflow::ready for review",
    ],
    commitBody: "Changelog: changed",
    enabledManagers: [
      "gomod",
      "custom.regex", // used by danger component
      "dockerfile",
    ],
    ...updateDangerReviewComponent,
    constraints: {
      "go": "1.22",
    },
    ignoreDeps: [
      "helm.sh/helm/v3", // Helm version needs to stay in sync with GitLab chart helm version
    ],
    packageRules: [
      {
        matchManager: ["dockerfile"],
        ignoreDeps: [ "golang" ], // Golang version is managed in .gitlab-ci.yml.
      },
      {
        matchManagers: ["gomod"],
        postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
        matchDepTypes: ["indirect"],
        commitMessageTopic: "{{{replace 'github.com\/prometheus-operator\/prometheus-operator\/pkg\/apis' 'prom-op-api' depName}}}",
      },
      {
        matchPackagePatterns: [".*k8s.io\/.*"],
        groupName: "k8s.io"
      },
      {
        matchPackagePatterns: ["github.com\/onsi\/.*"],
        groupName: "testing"
      },
    ],
  },
]);