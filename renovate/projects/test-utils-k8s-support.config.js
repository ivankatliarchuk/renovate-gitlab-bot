// NOTE: ~group::environments use this renovate config as a boring solution
// to get notified about new Kubernetes minor releases.
// See https://gitlab.com/gitlab-org/gitlab/-/issues/506286
const {
  createServerConfig,
  baseConfig,
  defaultLabels,
} = require("../lib/shared");

module.exports = createServerConfig(
  [
    {
      repository: "gitlab-renovate-forks/cluster-integration-test-utils-k3s-gitlab-ci",
      ...baseConfig,
      extends: ["group:commitlintMonorepo"],
      labels: [
        ...defaultLabels,
        "group::environments",
        "Category:Kubernetes Management",
      ],
      dependencyDashboard: false,
      enabledManagers: ["custom.regex"],
      reviewers: ["nagyv-gitlab", "nmezzopera"],
      customManagers: [
        {
          customType: "regex",
          fileMatch: ["^README.md$"],
          matchStrings: ['\\n\\s*-\\s*name:\\s*registry.gitlab.com\/gitlab-org\/cluster-integration\/test-utils\/k3s-gitlab-ci\/releases\/(?<currentValue>.*?)-k3s1\\n'],
          depNameTemplate: "kubernetes/kubernetes",
          datasourceTemplate: "github-releases",
        },
      ],
    },
  ],
);
