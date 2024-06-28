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
    enabledManagers: ["gomod", "custom.regex"],
    ...updateDangerReviewComponent,
    constraints: {
      "go": "1.22",
    },
    ignoreDeps: [
      "helm.sh/helm/v3", // Helm version needs to stay in sync with GitLab chart helm version
    ],
    packageRules: [
      {
        matchManagers: ["gomod"],
        postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
        matchDepTypes: ["indirect"],
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
