import { consolidateVersion, getToolVersionsFromRepository } from "./asdf.mjs";

/**
 * These managers do not need any language installed
 */
const TOOL_INDEPENDENT_MANAGERS = [
  "asdf",
  "dockerfile",
  "gitlabci",
  "nvm",
  "regex",
  "terraform",
];

const MANAGER_TO_ASDF_TOOL_MAP = {
  gomod: "golang",
  bundler: "ruby",
  npm: "nodejs",
};

/**
 * This parses a list of renovate repository configurations and returns
 * the language dependencies needed for those repositories.
 *
 * For example the `gomod` manager would require `golang` installed.
 *
 * This script also tries to get the `.tool-versions` file from the
 * repositories to install the appropriate version of e.g. golang.
 */
async function getToolsForRepositories(repositories) {
  const enabledTools = [];
  for (const repo of repositories) {
    const { repository, enabledManagers } = repo;
    const toolVersions = await getToolVersionsFromRepository(repository);
    for (const manager of enabledManagers) {
      if (TOOL_INDEPENDENT_MANAGERS.includes(manager)) {
        continue;
      }

      const tool = MANAGER_TO_ASDF_TOOL_MAP[manager];

      if (!tool) {
        throw new Error(`Unknown tool for ${manager}`);
      }

      enabledTools.push(await consolidateVersion(toolVersions, tool));
    }
  }

  // Ensure that node is added, as we need it for renovate itself
  const nodeVersion = enabledTools.find((x) => x.startsWith("node"));
  if (!nodeVersion) {
    enabledTools.push(await consolidateVersion({}, "nodejs"));
  }

  return enabledTools;
}

export async function loadRenovateConfig(file) {
  const { default: config } = await import(file);

  const extraTools = await getToolsForRepositories(config.repositories);

  console.warn(`Checking ${file}`);

  return { file, needToBeInstalled: extraTools };
}
