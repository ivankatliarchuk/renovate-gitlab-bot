const {
    createServerConfig,
    baseConfig,
    defaultLabels,
} = require("../lib/shared");


  module.exports = createServerConfig([
    {
      repository: "gitlab-renovate-forks/http-router",
      ...baseConfig,
      labels: [
        ...defaultLabels,
        "group::tenant scale",
        "devops::data stores",
        "section::core platform",
      ],
      reviewers: ["tkuah", "sxuereb", "bmarjanovic", "OmarQunsulGitlab"],
      reviewersSampleSize: 1,
      enabledManagers: ["npm"],
    },
  ]);
