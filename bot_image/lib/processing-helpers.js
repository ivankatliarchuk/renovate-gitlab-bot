const { log } = require("./logger");
const { DRY_RUN } = require("./constants");
const { forEachMR } = require("./api");

function cleanLabels(labels) {
  return labels.filter((l) => l !== "Community contribution");
}

async function runProcessingOnConfig(fn) {
  if (DRY_RUN) {
    log("DRY RUN ENABLED");
  }

  const [config] = process.argv.slice(2);

  const { repositories } = require(config);

  await forEachMR(repositories, fn);
}

module.exports = {
  runProcessingOnConfig,
  cleanLabels,
};
