import { consolidateVersion, getToolVersionsFromRepository } from "./asdf.mjs";

/**
 * These managers do not need any language installed
 */
const LANGUAGE_INDEPENDENT_MANAGERS = [
  "asdf",
  "dockerfile",
  "gitlabci",
  "nvm",
  "regex",
  "terraform",
];

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
    // This hack forces the install of a node version which is needed
    // to run renovate itself.
    if (!enabledManagers.includes("npm")) {
      enabledManagers.push("npm");
    }
    for (const manager of enabledManagers) {
      if (LANGUAGE_INDEPENDENT_MANAGERS.includes(manager)) {
        continue;
      }

      let tool = "";

      if (manager === "gomod") {
        tool = "golang";
      } else if (manager === "bundler") {
        tool = "ruby";
      } else if (manager === "npm") {
        tool = "nodejs";
      }

      if (!tool) {
        throw new Error(`Unknown manager ${manager}`);
      }

      const consolidated = await consolidateVersion(toolVersions, tool);

      if (consolidated) {
        enabledTools.push(consolidated);
      }
    }
  }
  return enabledTools;
}

export async function loadRenovateConfig(file) {
  const { default: config } = await import(file);

  const extraTools = await getToolsForRepositories(config.repositories);

  console.warn(`Checking ${file}`);

  return { file, needToBeInstalled: extraTools };
}
