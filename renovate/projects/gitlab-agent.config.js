const {
  createServerConfig,
  defaultLabels,
  baseConfig,
  availableRouletteReviewerByRole,
} = require("../lib/shared");
const { updateDangerReviewComponent } = require("../lib/components");

module.exports = createServerConfig([
  {
    repository: "gitlab-renovate-forks/gitlab-agent",
    ...baseConfig,
    // NOTE: groups k8s.io Go package updates, see
    // https://docs.renovatebot.com/presets-group/#groupkubernetes
    extends: ["group:kubernetes"],
    reviewers: availableRouletteReviewerByRole("gitlab-agent", ["maintainer"]),
    labels: [
      ...defaultLabels,
      "group::environments",
      "devops::deploy",
      "section::cd",
    ],
    postUpdateOptions: [],
    enabledManagers: ["gomod", "custom.regex"],
    includePaths: ["*", ".gitlab/*"],
    packageRules: [
      {
        groupName: "opentelemetry packages",
        groupSlug: "otel-go",
        matchDatasources: ["go"],
        matchPackageNames: [
          "go.opentelemetry.io/otel",
          "go.opentelemetry.io/otel/**",
          "go.opentelemetry.io/contrib/**",
        ],
      },
      {
        groupName: "github.com/redis/rueidis packages",
        groupSlug: "redis-rueidis-go",
        matchDatasources: ["go"],
        matchPackageNames: [
          "github.com/redis/rueidis",
          "github.com/redis/rueidis/**",
        ],
      },
      {
        matchDepNames: ["gitlab-agent-ci-image"],
        groupName: "gitlab-agent-ci-image",
      },
      {
        matchDepNames: ["base container images"],
        groupName: "gitlab-agent-base-container-images",
        extends: ["schedule:weekly"],
      },
      {
        matchFileNames: [
          "gitlab-agent/internal/module/starboard_vulnerability/**/*",
        ],
        reviewers: ["nilieskou"],
      },
      {
        matchPackageNames: ["docker"],
        matchDatasources: ["docker"],
        matchManagers: ["custom.regex"],
        customChangelogUrl: "https://github.com/moby/moby",
        minimumReleaseAge: "1 days",
      },
      {
        // This is our basic rule for Go packages.
        matchManagers: ["gomod"],
        enabled: true,
        commitMessagePrefix: "go:",
        postUpdateOptions: ["gomodTidy", "gomodUpdateImportPaths"],
      },
      {
        // The Go version cannot easily be upgraded in an automated way as
        // this needs to be coordinated globally across all GitLab
        // components. We thus disable upgrades to the Go language version.
        matchManagers: ["gomod"],
        matchDepTypes: ["golang"],
        enabled: false,
      },
      {
        // We don't want transitive dependencies to be updated.
        matchManagers: ["gomod"],
        matchDepTypes: ["indirect"],
        enabled: false,
      },

      {
        groupName: "google.golang.org/genproto/googleapis/rpc package",
        groupSlug: "genproto-googleapis-rpc",
        matchDatasources: ["go"],
        matchPackageNames: ["google.golang.org/genproto/googleapis/rpc"],
        extends: ["schedule:weekly"],
      },
      {
        groupName: "google.golang.org/api package",
        groupSlug: "google-golang-org-api",
        matchDatasources: ["go"],
        matchPackageNames: ["google.golang.org/api"],
        extends: ["schedule:weekly"],
      },
    ],
    customManagers: [
      {
        customType: "regex",
        fileMatch: [".gitlab/.gitlab-ci.yml"],
        matchStrings: [
          '\n\\s*BUILD_IMAGE_SHA:\\s*"(?<currentValue>[^@]+)@(?<currentDigest>sha256:[a-f0-9]+)"\n',
        ],
        depNameTemplate: "gitlab-agent-ci-image",
        packageNameTemplate: "gitlab/gitlab-agent-ci-image",
        datasourceTemplate: "docker",
      },
      {
        customType: "regex",
        fileMatch: [".gitlab/.gitlab-ci.yml"],
        matchStrings: [
          '\n\\s*FIPS_BUILD_IMAGE_SHA:\\s*"(?<currentValue>[^@]+)@(?<currentDigest>sha256:[a-f0-9]+)"\n',
        ],
        depNameTemplate: "gitlab-agent-ci-image",
        packageNameTemplate: "gitlab/gitlab-agent-ci-image",
        datasourceTemplate: "docker",
      },
      {
        customType: "regex",
        fileMatch: [".gitlab/.gitlab-ci.yml"],
        matchStrings: ['\n\\s*DOCKER_VERSION:\\s*"(?<currentValue>[^"]+)"'],
        depNameTemplate: "docker",
        datasourceTemplate: "docker",
      },
      {
        customType: "regex",
        fileMatch: ["MODULE.bazel"],
        matchStrings: [
          "\n#\\s*(?<currentValue>\\S+)\\s+from.*?\n" +
            "\\s*oci\\.pull\\(\n" +
            '\\s*name\\s*=\\s*"[^"]+",\n' +
            '\\s*digest\\s*=\\s*"(?<currentDigest>sha256:[a-f0-9]+)",\n' +
            '\\s*image\\s*=\\s*"(?<image>[^"]+)"',
        ],
        depNameTemplate: "base container images",
        packageNameTemplate: "{{{image}}}",
        datasourceTemplate: "docker",
      },
      {
        customType: "regex",
        includePaths: ["internal/module/starboard_vulnerability/agent/*"],
        fileMatch: ["internal/module/starboard_vulnerability/agent/worker.go"],
        matchStrings: [
          '\n\\s*defaultTrivyK8sWrapperImageTag\\s*=\\s*"(?<currentValue>.*)"\n',
        ],
        datasourceTemplate: "gitlab-releases", // although it is a docker image, use gitlab-releases so we get richer information in the MR
        registryUrlTemplate: "https://gitlab.com",
        depNameTemplate: "trivy-k8s-wrapper",
        packageNameTemplate:
          "gitlab-org/security-products/analyzers/trivy-k8s-wrapper",
        extractVersionTemplate: "^v(?<version>.*)$",
      },
      ...updateDangerReviewComponent.customManagers,
    ],
  },
]);
