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
    repository: "gitlab-renovate-forks/gitlab-vscode-extension",
    ...baseConfig,
    labels: [
      ...defaultLabels,
      "group::editor extensions",
      "devops::create",
      "section::dev",
    ],
    reviewers: availableRouletteReviewerByRole("gitlab-vscode-extension"),
    reviewersSampleSize: 1,
    enabledManagers: ["npm"],
    packageRules: [
      {
        ...enableWithBumpStrategy,
        matchPackageNames: ["@types/jest", "jest", "ts-jest", "jest-junit"],
        groupName: "Unit testing",
      },
      {
        ...enableWithBumpStrategy,
        matchPackageNames: [
          "@types/sinon",
          "sinon",
          "mocha",
          "mocha-junit-reporter",
          "msw",
        ],
        groupName: "Integration testing",
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
          "eslint-config-airbnb-base",
          "eslint-config-prettier",
          "eslint-plugin-import",
          "@typescript-eslint/eslint-plugin",
          "@typescript-eslint/parser",
          "prettier",
        ],
        groupName: "Linting",
      },
      {
        ...enableWithBumpStrategy,
        matchPackageNames: ["@gitlab-org/gitlab-lsp"],
        groupName: "GitLab Language Server",
        reviewers: ["tristan.read", "ohoral", "erran", "viktomas"],
      },
      {
        matchPackageNames: ["@types/node", "@types/vscode", "vscode"],
        enabled: false,
      },
    ],
  },
]);
