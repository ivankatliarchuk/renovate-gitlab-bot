import factory from "gitlab-api-async-iterator";

import { log } from "./logger.mjs";
import { RENOVATE_BOT_USER } from "./constants.mjs";

const { GitLabAPI, GitLabAPIIterator } = factory();

export const createRenovateMRIterator = (projectId = null) => {
  const url = projectId
    ? `/projects/${projectId}/merge_requests`
    : "/merge_requests";

  return new GitLabAPIIterator(url, {
    author_username: RENOVATE_BOT_USER,
    state: "opened",
    scope: "all",
  });
};

const userMap = {};

async function getUserId(usernameRaw) {
  const username = usernameRaw.startsWith("@")
    ? usernameRaw.substring(1)
    : usernameRaw;

  if (!userMap[username]) {
    const lcUsername = username.toLowerCase();
    log(`Retrieving ID for ${username} (searching with ${lcUsername}`);
    const { data } = await GitLabAPI.get(`/users?username=${lcUsername}`);
    userMap[username] =
      data.find((u) => u.username.toLowerCase() === lcUsername)?.id || null;
  }

  return userMap[username];
}

export async function getUserIds(usernames) {
  const all = await Promise.all([usernames].flat().map(getUserId));
  return all.filter(Boolean);
}

async function getProjectFromSlug(projectSlug) {
  const { data: project } = await GitLabAPI.get(
    `/projects/${encodeURIComponent(projectSlug)}`
  );
  return project;
}

export async function forEachMR(repositories, fn) {
  for await (const repositoryConfig of repositories) {
    const project = await getProjectFromSlug(repositoryConfig.repository);
    const { web_url: projectUrl, forked_from_project: upstreamProject } =
      project;
    const { web_url: upstreamProjectUrl, id: upstreamId } = upstreamProject;
    const { branchPrefix = "renovate/", packageRules = [] } = repositoryConfig;
    // Package rules could overwrite branch prefixes, so we need to get the union of those
    const branchPrefixes = [branchPrefix].concat(
      packageRules.flatMap((rule) =>
        rule.branchPrefix ? rule.branchPrefix : []
      )
    );

    log(`Working on project: ${projectUrl}`);
    log(`Upstream project seems to be: ${upstreamProjectUrl}`);
    const MRIterator = createRenovateMRIterator(upstreamId);
    for await (const mr of MRIterator) {
      const { web_url, source_branch: sourceBranch } = mr;
      log(`Checking ${web_url}`);

      if (!branchPrefixes.some((prefix) => sourceBranch.startsWith(prefix))) {
        log(
          `Source Branch '${sourceBranch}' does not start with any of '${branchPrefixes.join(
            "', '"
          )}'. Skipping`
        );
        continue;
      }

      await fn(mr, repositoryConfig);
    }
  }
}

export { GitLabAPI, GitLabAPIIterator };
