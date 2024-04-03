const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

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
    enabledManagers: ["npm"],
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
        matchPackageNames: ["jest", "jest-junit", "@types/jeset"],
        groupName: "Testing",
      },
      {
        ...enableWithBumpStrategy,
        matchPackageNames: [
          "cross-fetch",
          "graphql-request",
          "graphql",
          "https-proxy-agent",
        ],
        groupName: "Fetch frameworks",
      },
      {
        ...enableWithBumpStrategy,
        matchPackageNames: ["request", "request-promise"],
        groupName: "Legacy fetch frameworks",
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
  },
]);
