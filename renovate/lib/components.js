const updateDangerReviewComponent = {
  customManagers: [
    {
      customType: "regex",
      fileMatch: ["\.gitlab-ci\.ya?ml$", "^\.gitlab\/ci\/"],
      matchStrings: ['gitlab-org/components/danger-review/danger-review@(?<currentValue>[\\d.]+)'],
      depNameTemplate: "danger-review",
      packageNameTemplate:
        "https://gitlab.com/gitlab-org/components/danger-review.git",
      datasourceTemplate: "git-tags",
    },
  ],
};

module.exports = {
  updateDangerReviewComponent,
};
