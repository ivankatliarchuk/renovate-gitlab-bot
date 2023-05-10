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
  updateNodeJS,
};
