const {
  createServerConfig,
  baseConfig,
  defaultLabels,
} = require("../lib/shared");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-workspaces-tools",
    ...baseConfig,
    reviewers: [
      "vtak",
      "cwoolley-gitlab",
      "pslaughter",
      "ealcantara",
      "cindy-halim",
      "zhaochen_li",
      "hkhanna2",
      "saahmed",
    ],
    reviewersSampleSize: 1,
    labels: [
      ...defaultLabels,
      "group::ide",
      "devops::create",
      "section::dev",
      "Category:Remote Development",
    ],
    enabledManagers: ["custom.regex"],
    separateMinorPatch: true,
    separateMultipleMajor: true,
    commitBody: "Changelog: changed",
    customManagers: [
      {
        fileMatch: ["^config.yaml$"],
        customType: "regex",
        matchStrings: ['repository: "https:\/\/gitlab\.com\/(?<packageName>.*)"\\s+tag: "(?<currentValue>[-\\w.]+)"'],
        datasourceTemplate: "gitlab-tags",
        registryUrlTemplate: "https://gitlab.com",
        depNameTemplate: "{{packageName}}",
        packageNameTemplate: "{{packageName}}",
        versioningTemplate:
          "regex:^v?(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)(-(?<revision>[-.\\w]+))?$",
      },
    ],
  },
]);
