const {
  createServerConfig,
  updateNothing,
  baseConfig,
  semanticPrefixFixDepsChoreOthers,
  availableRouletteReviewerByRole,
  defaultLabels,
} = require("../lib/shared");
const {
  prJest,
  prBabel,
  prVueMajor2,
  updateDOMPurify,
  prGitLabScopeAndLinters,
} = require("../lib/npm");
const { updateNodeJS } = require("../lib/languages");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-ui",
    ...baseConfig,
    reviewers: availableRouletteReviewerByRole(
      "gitlab-ui",
      "maintainer frontend"
    ),
    labels: [...defaultLabels, "frontend"],
    internalChecksFilter: "strict",
    separateMultipleMajor: true,
    minimumReleaseAge: "3 days",
    rangeStrategy: "auto",
    semanticCommits: "enabled",
    enabledManagers: ["npm", "asdf", "custom.regex", "nvm"],
    packageRules: [
      ...semanticPrefixFixDepsChoreOthers,
      updateNothing,
      ...prGitLabScopeAndLinters,
      {
        ...updateDOMPurify,
        rangeStrategy: "update-lockfile",
      },
      {
        groupName: "Playwright",
        matchPackagePatterns: ["playwright"],
        enabled: true,
      },
      {
        matchPackagePatterns: ["storybook"],
        reviewers: ["pgascouvaillancourt"],
        enabled: true,
        groupName: "Storybook",
      },
      {
        matchPackageNames: ["cypress"],
        enabled: true,
      },
      prJest,
      prBabel,
      prVueMajor2,
      ...updateNodeJS.packageRules,
    ],
    customManagers: [
      ...updateNodeJS.customManagers([
        "^.gitlab-ci.yml",
        "^Dockerfile.puppeteer",
      ]),
      {
        customType: "regex",
        fileMatch: ["^.gitlab-ci.yml"],
        matchStrings: [
          "mcr.microsoft.com/playwright:v(?<currentValue>[\\d.]+)([a-z-]+)?",
        ],
        depNameTemplate: "playwright",
        datasourceTemplate: "npm",
        versioningTemplate: "npm",
      },
    ],
  },
]);
