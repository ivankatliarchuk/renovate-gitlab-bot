const factory = require("gitlab-api-async-iterator");
const { RENOVATE_BOT_USER } = require("./constants");
const { log } = require("./logger");
const { GitLabAPI, GitLabAPIIterator } = factory();

const createRenovateMRIterator = () =>
  new GitLabAPIIterator("/merge_requests", {
    author_username: RENOVATE_BOT_USER,
    state: "opened",
    scope: "all",
  });

const usermap = {};

async function getUserId(usernameRaw) {
  const username = usernameRaw.startsWith("@")
    ? usernameRaw.substring(1)
    : usernameRaw;

  if (!usermap[username]) {
    log(`Retrieving ID for ${username}`);
    const { data } = await GitLabAPI.get(`/users?username=${username}`);
    usermap[username] = data.find((u) => u.username === username).id;
  }

  return usermap[username];
}

module.exports = {
  GitLabAPI,
  GitLabAPIIterator,
  createRenovateMRIterator,
  getUserId,
};
