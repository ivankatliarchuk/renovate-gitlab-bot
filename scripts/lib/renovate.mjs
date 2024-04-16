import { consolidateVersion } from "./asdf.mjs";
import { loadRawRenovateConfig } from "../../bot_image/lib/load-raw-renovate-config.mjs";

/**
 * These managers do not need any language installed
 */
const TOOL_INDEPENDENT_MANAGERS = [
  "asdf",
  "dockerfile",
  "docker-compose",
  "gitlabci",
  "gitlabci-include",
  "nvm",
  "custom.regex",
  "terraform",
];

const MANAGER_TO_ASDF_TOOL_MAP = {
  gomod: "golang",
  bundler: "ruby",
  npm: "nodejs",
  cargo: "rust",
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
  for (const repositoryConfig of repositories) {
    const { enabledManagers } = repositoryConfig;
    for (const manager of enabledManagers) {
      if (TOOL_INDEPENDENT_MANAGERS.includes(manager)) {
        continue;
      }

      const tool = MANAGER_TO_ASDF_TOOL_MAP[manager];

      if (!tool) {
        throw new Error(`Unknown tool for ${manager}`);
      }

      enabledTools.push(await consolidateVersion(repositoryConfig, tool));
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
  const config = await loadRawRenovateConfig(file);

  const extraTools = await getToolsForRepositories(config.repositories);

  console.warn(`Checking ${file}`);

  return { file, needToBeInstalled: extraTools };
}
