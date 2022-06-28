const {
  createServerConfig,
  baseConfig,
  updateOnlyGitLabScope,
} = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/status-page",
    ...baseConfig,
    ...updateOnlyGitLabScope,
    assignees: ["@ohoral", "@oregand", "@tristan.read"],
    semanticCommits: "disabled",
  },
]);
