const {
  createServerConfig,
  baseConfig,
  semanticPrefixFixDepsChoreOthers,
  updateOnlyGitLabScopePackageRules,
} = require("../shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/design.gitlab.com",
    ...baseConfig,
    packageRules: [
      ...updateOnlyGitLabScopePackageRules,
      ...semanticPrefixFixDepsChoreOthers,
    ],
    semanticCommits: "enabled",
  },
]);
