const factory = require("gitlab-api-async-iterator");
const { RENOVATE_BOT_USER } = require("./constants");
const { log } = require("./logger");
const { GitLabAPI, GitLabAPIIterator } = factory();

const createRenovateMRIterator = (projectId = null) => {
  const url = projectId
    ? `/projects/${projectId}/merge_requests`
    : "/merge_requests";

  return new GitLabAPIIterator(url, {
    author_username: RENOVATE_BOT_USER,
    state: "opened",
    scope: "all",
  });
};

const usermap = {};

async function getUserId(usernameRaw) {
  const username = usernameRaw.startsWith("@")
    ? usernameRaw.substring(1)
    : usernameRaw;

  if (!usermap[username]) {
    const lcUsername = username.toLowerCase();
    log(`Retrieving ID for ${username} (searching with ${lcUsername}`);
    const { data } = await GitLabAPI.get(`/users?username=${lcUsername}`);
    usermap[username] =
      data.find((u) => u.username.toLowerCase() === lcUsername)?.id || null;
  }

  return usermap[username];
}

async function getUserIds(usernames) {
  const all = await Promise.all([usernames].flat().map(getUserId));
  return all.filter(Boolean);
}

async function getProjectFromSlug(projectSlug) {
  const { data: project } = await GitLabAPI.get(
    `/projects/${encodeURIComponent(projectSlug)}`
  );
  return project;
}

async function forEachMR(repositories, fn) {
  for await (const repositoryConfig of repositories) {
    const project = await getProjectFromSlug(repositoryConfig.repository);
    const { web_url: projectUrl, forked_from_project: upstreamProject } =
      project;
    const { web_url: upstreamProjectUrl, id: upstreamId } = upstreamProject;
    const { branchPrefix = "renovate/" } = repositoryConfig;

    log(`Working on project: ${projectUrl}`);
    log(`Upstream project seems to be: ${upstreamProjectUrl}`);
    const MRIterator = createRenovateMRIterator(upstreamId);
    for await (const mr of MRIterator) {
      const { web_url, source_branch: sourceBranch } = mr;
      log(`Checking ${web_url}`);

      if (!sourceBranch.startsWith(branchPrefix)) {
        log(
          `Source Branch '${sourceBranch}' does not start with '${branchPrefix}'. Skipping`
        );
        continue;
      }

      await fn(mr, repositoryConfig);
    }
  }
}

module.exports = {
  GitLabAPI,
  GitLabAPIIterator,
  createRenovateMRIterator,
  getUserId,
  getUserIds,
  forEachMR,
};
