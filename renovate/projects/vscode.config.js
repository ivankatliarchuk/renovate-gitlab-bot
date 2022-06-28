const {
  createServerConfig,
  baseConfig,
  enableWithBumpStrategy,
} = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-vscode-extension",
    ...baseConfig,
    labels: [
      "maintenance::dependency",
      "type::maintenance",
      "group::code review",
      "devops::create",
      "automation:bot-authored",
    ],
    assignees: ["@viktomas"],
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
        matchPackageNames: ["@types/node", "@types/vscode"],
        enabled: false,
      },
    ],
  },
]);
