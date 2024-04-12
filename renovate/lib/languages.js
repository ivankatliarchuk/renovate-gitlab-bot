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
  customManagers: (fileMatch = ["^.gitlab-ci.yml"]) => [
    {
      customType: "regex",
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
