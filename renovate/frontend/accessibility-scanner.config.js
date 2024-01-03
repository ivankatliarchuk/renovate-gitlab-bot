const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  updateNothing,
} = require("../lib/shared");
const { prVueMajor2, prBabel, prJest, prGitLabUISVG } = require("../lib/npm");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/accessibility-scanner",
    ...baseConfig,
    labels: [...defaultLabels, "WG::product accessibility"],
    includePaths: [
      // The top-level package
      "*",
      // The dashboard workspace
      "dashboard/**",
    ],
    reviewers: ["psjakubowska", "deepika.guliani"],
    rangeStrategy: "auto",
    enabledManagers: ["npm"],
    packageRules: [updateNothing, prGitLabUISVG, prVueMajor2, prBabel, prJest],
    updateInternalDeps: true,
    schedule: ["on the first day of the month"],
  },
]);
