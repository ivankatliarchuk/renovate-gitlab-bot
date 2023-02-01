const prJest = {
  matchPackageNames: ["jest", "jest-environment-jsdom", "jest-circus"],
  enabled: true,
  groupName: "Jest",
};

const prBabel = {
  matchPackagePatterns: ["@babel.+"],
  enabled: true,
  groupName: "Babel",
};

/**
 * Update vue, template compiler and server renderer to latest Major 2 version
 */
const prVueMajor2 = {
  matchPackageNames: ["vue", "vue-template-compiler", "vue-server-renderer"],
  rangeStrategy: "bump",
  allowedVersions: "<3",
  enabled: true,
  groupName: "Vue",
};

const updateNodeJS = {
  packageRules: [
    {
      enabled: true,
      rangeStrategy: "pin",
      matchPackageNames: ["node"],
      matchManagers: ["asdf", "regex", "nvm"],
      groupName: "NodeJS Version",
    },
  ],
  regexManagers: (fileMatch = ["^.gitlab-ci.yml"]) => [
    {
      fileMatch,
      matchStrings: ["node:(?<currentValue>[\\d.]+)([a-z-]+)?"],
      depNameTemplate: "node",
      packageNameTemplate: "nodejs/node",
      datasourceTemplate: "github-tags",
      versioningTemplate: "node",
    },
  ],
};

module.exports = {
  prBabel,
  prJest,
  prVueMajor2,
  updateNodeJS,
};
