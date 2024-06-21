const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

const enableWithBumpStrategy = {
  rangeStrategy: "bump",
  enabled: true,
};

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-lsp",
    ...baseConfig,
    labels: [
      ...defaultLabels,
      "group::editor extensions",
      "devops::create",
      "section::dev",
    ],
    reviewers: availableRouletteReviewerByRole("gitlab-lsp"),
    reviewersSampleSize: 1,
    enabledManagers: ["npm", "custom.regex"],
    packageRules: [
      {
        ...enableWithBumpStrategy,
        matchPackageNames: [
          "vscode-languageserver",
          "vscode-languageserver-protocol",
          "vscode-languageserver-textdocument",
        ],
        groupName: "Language Server Protocol",
      },
      {
        ...enableWithBumpStrategy,
        matchPackageNames: ["jest", "jest-junit", "@types/jest"],
        groupName: "Testing",
      },
      {
        ...enableWithBumpStrategy,
        matchPackageNames: [
          "cross-fetch",
          "get-proxy-settings",
          "proxy-agent",
        ],
        groupName: "Fetch frameworks",
      },
      {
        ...enableWithBumpStrategy,
        matchPackageNames: [
          "eslint",
          "@typescript-eslint/eslint-plugin",
          "prettier",
        ],
        groupName: "Linting",
      },
      {
        matchPackageNames: ["@types/node"],
        enabled: false,
      },
    ],
    ...updateDangerReviewComponent,
  },
]);
