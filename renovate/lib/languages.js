const updateNodeJS = {
  packageRules: [
    {
      enabled: true,
      rangeStrategy: "pin",
      matchPackageNames: ["node"],
      matchManagers: ["asdf", "custom.regex", "nvm"],
      groupName: "NodeJS Version",
    },
  ],
  customManagers: (fileMatch = ["^.gitlab-ci.yml"]) => [
    {
      customType: "regex",
      fileMatch,
      matchStrings: ["node:(?<currentValue>[\\d.]+)([a-z-]+)?"],
      depNameTemplate: "node",
      datasourceTemplate: "node-version",
      versioningTemplate: "node",
    },
  ],
};

module.exports = {
  updateNodeJS,
};
