const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  updateGitLabUIandSVG,
  updateNothing,
  availableRouletteReviewerByRole,
} = require("../shared");
const { prVueMajor2, prBabel, prJest } = require("../frontend");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/pajamas-adoption-scanner",
    ...baseConfig,
    labels: [...defaultLabels, "group::foundations"],
    includePaths: [
      // The top-level package
      "*",
      // The dashboard workspace
      "dashboard/**",
    ],
    reviewers: ["markrian"],
    packageRules: [
      updateNothing,
      updateGitLabUIandSVG,
      prVueMajor2,
      prBabel,
      prJest,
    ],
    updateInternalDeps: true,
  },
]);
