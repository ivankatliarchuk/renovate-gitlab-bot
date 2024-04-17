import path from "node:path";
import { fileURLToPath } from "node:url";
import glob from "glob";
import { loadRawRenovateConfig } from "../../bot_image/lib/load-raw-renovate-config.mjs";

export async function loadAllConfigs() {
  const ROOT_DIR = path.join(fileURLToPath(import.meta.url), "..", "..", "..");

  const configFiles = glob.sync(
    path.join(ROOT_DIR, "renovate", "**", "*.config.js")
  );

  console.log(`Found ${configFiles.length} renovate config files`);

  const configs = {};

  for (const file of configFiles) {
    configs[file] = await loadRawRenovateConfig(file);
  }

  return configs;
}
