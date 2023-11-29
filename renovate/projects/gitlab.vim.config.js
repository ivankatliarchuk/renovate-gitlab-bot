const fs = require("fs");
const path = require("path");
const {
  createServerConfig,
  baseConfig,
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");

const enableWithBumpStrategy = {
  rangeStrategy: "bump",
  enabled: true,
};

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab.vim",
    ...baseConfig,
    labels: [
      ...defaultLabels,
      "group::editor",
      "devops::create",
      "section::dev",
    ],
    reviewers: availableRouletteReviewerByRole("gitlab-vim"),
    reviewersSampleSize: 1,
    enabledManagers: ["npm"],
    packageRules: [
      {
        ...enableWithBumpStrategy,
        matchPackageNames: ["@gitlab-org/gitlab-lsp"],
        groupName: "GitLab Language Server",
      },
    ],
    renovateMetaCommentTemplate: fs.readFileSync(
      path.join(__dirname, "..", "comment_templates", "editor_extension.md"),
      "utf-8"
    ),
  },
]);
