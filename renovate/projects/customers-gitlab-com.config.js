const { createServerConfig, updateOnlyGitLabScope } = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/customers-gitlab-com",
    ...updateOnlyGitLabScope,
    assignees: ["@vitallium", "@aalakkad"],
    semanticCommits: "disabled",
  },
]);
