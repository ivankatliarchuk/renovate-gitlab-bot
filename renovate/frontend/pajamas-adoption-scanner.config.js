const {
  createServerConfig,
  baseConfig,
  designSystemLabels,
  updateNothing,
} = require("../lib/shared");
const { prVueMajor2, prBabel, prJest, prGitLabUISVG } = require("../lib/npm");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/pajamas-adoption-scanner",
    ...baseConfig,
    labels: designSystemLabels,
    includePaths: [
      // The top-level package
      "*",
      // The dashboard workspace
      "dashboard/**",
    ],
    reviewers: ["markrian"],
    rangeStrategy: "auto",
    enabledManagers: ["npm"],
    packageRules: [updateNothing, prGitLabUISVG, prVueMajor2, prBabel, prJest],
    updateInternalDeps: true,
    schedule: ["on the first day of the month"],
  },
]);
