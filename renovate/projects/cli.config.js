const {
    createServerConfig,
    baseConfig,
    defaultLabels,
    availableRouletteReviewerByRole,
} = require("../lib/shared");
  
module.exports = createServerConfig(
    [
        {
            repository: "gitlab-renovate-forks/cli",
            ...baseConfig,
            reviewers: availableRouletteReviewerByRole("gitlab-cli"),
            reviewersSampleSize: 1,
            labels: [
            ...defaultLabels,
            "group::code review",
            "devops::create",
            "section::dev",
            "Category:GitLab CLI",
            "type::maintenance",
            ],
            rangeStrategy: "bump",
            enabledManagers: ["gomod"],
            postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
            packageRules: [],
        }
    ]
);
