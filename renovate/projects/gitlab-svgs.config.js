const {
  createServerConfig,
  baseConfig,
  updateOnlyGitLabScopePackageRules,
} = require("../shared");
const { updateNodeJS } = require("../frontend");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-svgs",
    ...baseConfig,
    enabledManagers: ["npm", "asdf", "regex"],
    packageRules: [
      ...updateOnlyGitLabScopePackageRules,
      ...updateNodeJS.packageRules,
    ],
    regexManagers: [...updateNodeJS.regexManagers()],
    semanticCommits: "disabled",
  },
]);
