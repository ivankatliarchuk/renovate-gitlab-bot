module.exports = {
  RENOVATE_PROJECT_ID: "15445883",
  DRY_RUN: (process.env.DRY_RUN ?? "true") === "true",
  RENOVATE_BOT_USER: "gitlab-dependency-update-bot",
  RENOVATE_STOP_UPDATING_LABEL: "automation:bot-no-updates",
};
