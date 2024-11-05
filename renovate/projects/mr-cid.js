const {
  createServerConfig,
  baseConfig,
  PSEBaseConfig,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/public-mr-confidential-issue-detector",
    ...baseConfig,
    ...PSEBaseConfig,
    prConcurrentLimit: 2,
    enabledManagers: ["bundler", "custom.regex"],
    postUpdateOptions: ["bundlerConservative"],
    semanticCommits: "disabled",
    ...updateDangerReviewComponent,
  },
]);
