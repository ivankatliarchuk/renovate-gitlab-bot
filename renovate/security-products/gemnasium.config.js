const {
  defaultLabels,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { baseConfig, createServerConfig } = require("../lib/shared");

const repository = "gitlab-renovate-forks/gemnasium";

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

// Data from the team.yml.
const reviewers = availableRouletteReviewerByRole("secure-DS-gemnasium", [
  "maintainer",
  "maintainer backend",
]);

// Managers that are enabled for this repo.
// See https://docs.renovatebot.com/modules/manager/ for more info.
const enabledManagers = ["dockerfile", "gomod"];

// Group dependency updates by analyzer and add labels to scope pipelines.
const dockerRules = [
  {
    matchCategories: ["docker"],
    groupName: "gemnasium alpine dependencies",
    description: "gemnasium alpine dependencies",
    matchFileNames: ["build/gemnasium/alpine/Dockerfile"],
    addLabels: ["trigger-gemnasium"],
  },
  {
    matchCategories: ["docker"],
    groupName: "gemnasium redhat dependencies",
    description: "gemnasium redhat dependencies",
    matchFileNames: ["build/gemnasium/redhat/Dockerfile"],
    addLabels: ["trigger-gemnasium"],
  },
  {
    matchCategories: ["docker"],
    groupName: "gemnasium-maven debian dependencies",
    description: "gemnasium-maven debian dependencies",
    matchFileNames: ["build/gemnasium-maven/debian/Dockerfile"],
    addLabels: ["trigger-gemnasium-maven"],
  },
  {
    matchCategories: ["docker"],
    groupName: "gemnasium-maven redhat dependencies",
    description: "gemnasium-maven redhat dependencies",
    matchFileNames: ["build/gemnasium-maven/redhat/Dockerfile"],
    addLabels: ["trigger-gemnasium-maven"],
  },
  {
    matchCategories: ["docker"],
    groupName: "gemnasium-python debian dependencies",
    description: "gemnasium-python debian dependencies",
    matchFileNames: ["build/gemnasium-python/debian/Dockerfile"],
    addLabels: ["trigger-gemnasium-python"],
  },
  {
    matchCategories: ["docker"],
    groupName: "gemnasium-python redhat dependencies",
    description: "gemnasium-python redhat dependencies",
    matchFileNames: ["build/gemnasium-python/redhat/Dockerfile"],
    addLabels: ["trigger-gemnasium-python"],
  },
];

const golangRules = [
  {
    matchCategories: ["golang"],
    postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
    addLabels: [
      "trigger-gemnasium",
      "trigger-gemnasium-maven",
      "trigger-gemnasium-python",
    ],
  },
];

const config = createServerConfig([
  {
    // Core config
    repository,
    dependencyDashboard: false,
    enabledManagers,
    includePaths,
    ignorePaths,
    labels,
    lockFileMaintenance,
    reviewers,
    reviewersSampleSize: 2,
    packageRules: [...dockerRules, ...golangRules],
  },
]);

module.exports = config;
