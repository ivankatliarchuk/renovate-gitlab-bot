const { updateNodeJS } = require("../lib/languages");
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
            includePaths: ["*", "scripts/commit-lint/*"],
            enabledManagers: ["asdf", "custom.regex", "gomod", "npm"],
            postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
            packageRules: [
                {
                    // We want updates to golang, but not vale in asdf
                    matchManagers: ["asdf"],
                    matchPackageNames: ["vale"],
                    enabled: false,
                },
                {
                    matchManagers: ["asdf", "gomod", "custom.regex"],
                    matchPackageNames: ["golang"],
                },
            ],
            customManagers: [
                {
                    customType: "regex",
                    fielMatch: ["^.gitlab-ci.yml"],
                    matchStrings: ['GO_VERSION: "?(?<currentValue>.*)"?\n'],
                    depNameTemplate: "gomod",
                    datasourceTemplate: "gomod",
                    versioningTemplate: "go-mod-directive",
                },
            ],
            dependencyDashboard: false,
        }
    ]
);
