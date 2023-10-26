import { log } from "./logger.mjs";
import { DRY_RUN } from "./constants.mjs";
import { forEachMR } from "./api.mjs";

export function cleanLabels(labels) {
  return labels.filter((l) => l !== "Community contribution");
}

export async function runProcessingOnConfig(fn) {
  if (DRY_RUN) {
    log("DRY RUN ENABLED");
  }

  const [file] = process.argv.slice(2);

  const { default: config } = await import(file);

  const { repositories } = config;

  await forEachMR(repositories, fn);
}
