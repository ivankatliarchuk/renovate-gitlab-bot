const { defaultLabels } = require("../shared");
const { baseConfig, createServerConfig } = require("../shared");

const repository = "gitlab-renovate-forks/gemnasium";

const hostRules = [{ host: "gitlab.com", token: process.env.RENOVATE_TOKEN }];

const labels = defaultLabels.concat(
  "devops::secure",
  "section::sec",
  "group::composition analysis",
  "Category: Dependency Scanning"
);

const includePaths = ["go.mod", "build/**/Dockerfile"];

// Ignore all fixtures and expectations.
const ignorePaths = ["qa/**"];

const lockFileMaintenance = baseConfig.lockFileMaintenance;

const stopUpdatingLabel = baseConfig.stopUpdatingLabel;

// If team changes or a username changes this must be updated.
const reviewers = [
  "adamcohen",
  "atiwari71",
  "brytannia",
  "fcatteau",
  "gonzoyumo",
  "hacks4oats",
  "ifrenkel",
  "nilieskou",
  "philipcunningham",
  "smtan",
];

// Managers that are enabled for this repo.
// See https://docs.renovatebot.com/modules/manager/ for more info.
const enabledManagers = ["dockerfile", "gomod"];

// Group dependency updates by analyzer and add labels to scope pipelines.
const docker = {
  packageRules: [
    {
      groupName: "gemnasium alpine dependencies",
      description: "gemnasium alpine dependencies",
      matchFiles: ["build/gemnasium/alpine/Dockerfile"],
      addLabels: ["trigger-gemnasium"],
    },
    {
      groupName: "gemnasium redhat dependencies",
      description: "gemnasium redhat dependencies",
      matchFiles: ["build/gemnasium/redhat/Dockerfile"],
      addLabels: ["trigger-gemnasium"],
    },
    {
      groupName: "gemnasium-maven debian dependencies",
      description: "gemnasium-maven debian dependencies",
      matchFiles: ["build/gemnasium-maven/debian/Dockerfile"],
      addLabels: ["trigger-gemnasium-maven"],
    },
    {
      groupName: "gemnasium-maven redhat dependencies",
      description: "gemnasium-maven redhat dependencies",
      matchFiles: ["build/gemnasium-maven/redhat/Dockerfile"],
      addLabels: ["trigger-gemnasium-maven"],
    },
    {
      groupName: "gemnasium-python debian dependencies",
      description: "gemnasium-python debian dependencies",
      matchFiles: ["build/gemnasium-python/debian/Dockerfile"],
      addLabels: ["trigger-gemnasium-python"],
    },
    {
      groupName: "gemnasium-python redhat dependencies",
      description: "gemnasium-python redhat dependencies",
      matchFiles: ["build/gemnasium-python/redhat/Dockerfile"],
      addLabels: ["trigger-gemnasium-python"],
    },
  ],
};

const golang = {
  postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
  addLabels: [
    "trigger-gemnasium",
    "trigger-gemnasium-maven",
    "trigger-gemnasium-python",
  ],
};

const config = createServerConfig([
  {
    // Core config
    repository,
    automerge: false,
    dependencyDashboard: false,
    includeForks: true,
    enabledManagers,
    includePaths,
    ignorePaths,
    labels,
    hostRules,
    lockFileMaintenance,
    reviewers,
    reviewersSampleSize: 2,
    stopUpdatingLabel,

    // Language config
    docker,
    golang,
  },
]);

module.exports = config;
