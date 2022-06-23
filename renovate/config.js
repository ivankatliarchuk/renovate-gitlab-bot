const fs = require("fs");
const path = require("path");

const baseConfig = {
  dependencyDashboard: true,
  includeForks: true,
  automerge: false,
  labels: [
    "frontend",
    "maintenance::dependency",
    "type::maintenance",
    "automation:bot-authored",
  ],
  lockFileMaintenance: { enabled: false, schedule: [] },
  enabledManagers: ["npm"],
  prConcurrentLimit: 20,
  assignees: [
    "@dmishunov",
    "@ealcantara",
    "@pgascouvaillancourt",
    "@mikegreiling",
    "@ohoral",
    "@markrian",
    "@svedova",
  ],
  assignAutomerge: true,
  assigneesSampleSize: 2,
  // Only include the first level of dependency files
  includePaths: ["*"],
  // Dedupe yarn dependencies
  postUpdateOptions: ["yarnDedupeFewer"],
  prBodyNotes: [
    `MR created with the help of [${process.env.CI_PROJECT_PATH}](${process.env.CI_PROJECT_URL})`,
  ],
  hostRules: [
    process.env.GITHUB_TOKEN
      ? {
          matchHost: "github.com",
          token: process.env.GITHUB_TOKEN,
        }
      : [],
    process.env.RENOVATE_TOKEN
      ? {
          matchHost: "gitlab.com",
          token: process.env.RENOVATE_TOKEN,
        }
      : [],
  ].flat(),
};

const updateNothing = {
  matchPackagePatterns: [".*"],
  enabled: false,
};

const updateGitLabScope = {
  enabled: true,
  rangeStrategy: "auto",
};

const updateGitLabUIandSVG = {
  ...updateGitLabScope,
  matchPackageNames: ["@gitlab/ui", "@gitlab/svgs"],
  groupName: "GitLab UI/SVG",
};

const updateGitLabVisualReviewTools = {
  ...updateGitLabScope,
  matchPackageNames: ["@gitlab/visual-review-tools"],
  groupName: "GitLab Visual Review Tools",
};

const ESLint = {
  ...updateGitLabScope,
  matchPackageNames: ["eslint"],
  matchPackagePatterns: ["eslint-.+"],
  excludePackageNames: ["@gitlab/eslint-plugin"],
  assignees: ["@markrian", "@vitallium"],
  groupName: "ESLint and related",
};

const Stylelint = {
  ...updateGitLabScope,
  matchPackageNames: ["@gitlab/stylelint-config"],
  matchPackagePatterns: ["stylelint-.+"],
  assignees: ["@vitallium", "@pgascouvaillancourt"],
  groupName: "Stylelint and related",
};

const updateGitLabScopeDev = {
  ...updateGitLabScope,
  matchPackagePatterns: ["@gitlab/.*"],
  excludePackageNames: [
    ...updateGitLabUIandSVG.matchPackageNames,
    ...updateGitLabVisualReviewTools.matchPackageNames,
    ...Stylelint.matchPackageNames,
  ],
  groupName: "GitLab Packages",
};

const updateOnlyGitLabScopePackageRules = [
  updateNothing,
  updateGitLabUIandSVG,
  ESLint,
  Stylelint,
  updateGitLabScopeDev,
];

const updateOnlyGitLabScope = {
  ...baseConfig,
  packageRules: updateOnlyGitLabScopePackageRules,
};

const updateFrontendObservability = {
  matchPackagePatterns: ["@sentry/browser"],
  rangeStrategy: "bump",
  enabled: true,
  assignees: ["@jivanvl"],
  groupName: "Frontend Observability Packages",
};

const updateDOMPurify = {
  matchPackageNames: ["dompurify"],
  rangeStrategy: "bump",
  enabled: true,
  assignees: ["@djadmin", "@markrian"],
};

const foundationPackages = {
  assignees: ["@leipert", "@mikegreiling"],
  addLabels: ["group::foundations", "automation:bot-authored"],
};

const semanticPrefixFixDepsChoreOthers = [
  {
    matchPackagePatterns: ["*"],
    semanticCommitType: "chore",
  },
  {
    matchDepTypes: ["dependencies", "require"],
    semanticCommitType: "fix",
  },
];

const enableWithBumpStrategy = {
  rangeStrategy: "bump",
  enabled: true,
};

module.exports = {
  dryRun: (process.env.DRY_RUN ?? "true") === "true" ? "full" : null,
  autodiscover: false,
  logFile: path.join(__dirname, "..", "renovate-log.txt"),
  logFileLevel: "debug",
  platform: "gitlab",
  onboarding: false,
  requireConfig: "ignored",
  printConfig: false,
  renovateMetaCommentTemplate: fs.readFileSync(
    path.join(__dirname, "comment_template.md"),
    "utf-8"
  ),
  gitAuthor: "GitLab Renovate Bot <gitlab-bot@gitlab.com>",
  allowedPostUpgradeCommands: [
    "^make notice$", // Allow Gitaly generating a new NOTICE file.
  ],
  repositories: [
    {
      repository: "gitlab-renovate-forks/gitlab",
      ...baseConfig,
      dependencyDashboardTitle: "Dependency Dashboard (node)",
      packageRules: [
        updateNothing,
        updateGitLabUIandSVG,
        updateGitLabVisualReviewTools,
        ESLint,
        Stylelint,
        updateGitLabScopeDev,
        {
          ...foundationPackages,
          matchPackagePatterns: [
            ".*-loader",
            ".*-webpack-plugin",
            "webpack-bundle-analyzer",
          ],
          excludePackageNames: [
            "three-stl-loader",
            "karma-sourcemap-loader",
            "jest-raw-loader",
            "monaco-editor-webpack-plugin",
          ],
          minor: {
            groupName: "Webpack related packages",
          },
          patch: {
            groupName: "Webpack related packages",
          },
          enabled: true,
          rangeStrategy: "bump",
        },
        {
          ...foundationPackages,
          matchPackageNames: ["webpack", "webpack-cli", "webpack-dev-server"],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Webpack core packages",
        },
        {
          ...foundationPackages,
          matchPackageNames: ["core-js"],
          enabled: true,
          rangeStrategy: "bump",
        },
        {
          ...foundationPackages,
          matchPackageNames: ["commander"],
          enabled: true,
          rangeStrategy: "bump",
        },
        {
          ...foundationPackages,
          matchPackageNames: ["yarn-deduplicate"],
          enabled: true,
          rangeStrategy: "bump",
        },
        {
          assignees: ["@samdbeckham"],
          matchPackageNames: [
            "vue",
            "vue-loader",
            "vue-router",
            "vue-template-compiler",
            "vuex",
          ],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Vue and related dependencies",
        },
        {
          assignees: ["@samdbeckham"],
          matchPackageNames: ["vue-virtual-scroll-list"],
          enabled: true,
          rangeStrategy: "bump",
        },
        {
          matchPackagePatterns: ["^@sourcegraph/*"],
          assignees: ["@pslaughter"],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Sourcegraph",
        },
        {
          matchPackageNames: [
            "monaco-editor",
            "monaco-yaml",
            "monaco-editor-webpack-plugin",
          ],
          assignees: ["@himkp", "@dmishunov"],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Monaco Editor and related packages",
        },
        {
          matchPackageNames: ["tiptap", "tiptap-extensions"],
          matchPackagePatterns: ["@tiptap/.*", "prosemirror-.*"],
          enabled: true,
          rangeStrategy: "bump",
          assignees: ["@himkp", "@ealcantara"],
          groupName: "Content Editor Packages",
        },
        updateDOMPurify,
        updateFrontendObservability,
      ],
      semanticCommits: "disabled",
    },
    {
      repository: "gitlab-renovate-forks/gitlab",
      dependencyDashboardTitle: "Dependency Dashboard (ruby)",
      ...baseConfig,
      labels: [
        "backend",
        "maintenance::dependency",
        "type::maintenance",
        "automation:bot-authored",
      ],
      branchPrefix: "renovate-gems/",
      assignees: ["@rymai"],
      enabledManagers: ["bundler"],
      semanticCommits: "disabled",
      packageRules: [
        updateNothing,
        {
          matchPackageNames: [
            "better_errors",
            "bootsnap",
            "brakeman",
            "danger",
            "lefthook",
            "letter_opener_web",
            "parser",
            "thin",
          ],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Ruby development dependencies",
        },
        {
          matchPackageNames: ["gitlab-styles", "gitlab-dangerfiles"],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "GitLab Tooling Ruby dependencies",
        },
        {
          matchPackageNames: ["nokogiri", "premailer", "re2", "rouge"],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Ruby Markdown and HTML parsing dependencies",
        },
        {
          matchPackageNames: ["pg", "pg_query"],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Ruby database dependencies",
        },
        {
          matchPackageNames: [
            "rack",
            "rack-accept",
            "rack-attack",
            "rack-cors",
            "rack-oauth2",
            "rack-proxy",
            "rack-test",
            "rack-timeout",
          ],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Ruby Rack-related dependencies",
        },
        {
          matchPackageNames: [
            "aws-sdk-core",
            "aws-sdk-s3"
          ],
          enabled: true,
          rangeStrategy: "bump",
          groupName: "Ruby AWS-related dependencies",
        },
      ],
    },
    {
      repository: "gitlab-renovate-forks/triage-ops",
      ...baseConfig,
      labels: [
        "backend",
        "maintenance::dependency",
        "type::maintenance",
        "automation:bot-authored",
      ],
      branchPrefix: "renovate-gems/",
      assignees: ["@rymai"],
      enabledManagers: ["bundler"],
      semanticCommits: "disabled",
      packageRules: [
        {
          // We don't want to update graphql as it's pinned due to a specific reason:
          // https://gitlab.com/gitlab-org/quality/triage-ops/-/blob/ecf3cf00bbf02/Gemfile#L15-17
          matchPackagePatterns: ["graphql"],
          enabled: false,
        },
        {
          enabled: true,
          matchPackagePatterns: [".+"],
          excludePackagePatterns: ["graphql"],
          rangeStrategy: "bump",
          matchManagers: ["bundler"],
          groupName: "Ruby production dependencies",
        },
        {
          enabled: true,
          matchDepTypes: ["test", "development"],
          rangeStrategy: "bump",
          matchManagers: ["bundler"],
          groupName: "Ruby development dependencies",
        },
      ],
    },
    {
      repository: "gitlab-renovate-forks/gitlab-ui",
      ...baseConfig,
      packageRules: [
        updateNothing,
        updateGitLabUIandSVG,
        ESLint,
        Stylelint,
        updateGitLabScopeDev,
        updateDOMPurify,
        {
          matchPackagePatterns: ["bootstrap-vue"],
          separateMultipleMajor: true,
          assignees: ["@pgascouvaillancourt"],
          rangeStrategy: "bump",
          enabled: true,
          groupName: "Bootstrap Vue",
        },
        {
          matchPackagePatterns: ["@storybook/.*"],
          assignees: ["@pgascouvaillancourt"],
          rangeStrategy: "bump",
          enabled: true,
          groupName: "Storybook",
        },
        ...semanticPrefixFixDepsChoreOthers,
      ],
      semanticCommits: "enabled",
    },
    {
      repository: "gitlab-renovate-forks/customers-gitlab-com",
      ...updateOnlyGitLabScope,
      assignees: ["@vitallium", "@aalakkad"],
      semanticCommits: "disabled",
    },
    {
      repository: "gitlab-renovate-forks/gitlab-svgs",
      ...updateOnlyGitLabScope,
      semanticCommits: "disabled",
    },
    {
      repository: "gitlab-renovate-forks/design.gitlab.com",
      ...baseConfig,
      packageRules: [
        ...updateOnlyGitLabScopePackageRules,
        ...semanticPrefixFixDepsChoreOthers,
      ],
      semanticCommits: "enabled",
    },
    {
      repository: "gitlab-renovate-forks/status-page",
      ...baseConfig,
      ...updateOnlyGitLabScope,
      assignees: ["@ohoral", "@oregand", "@tristan.read"],
      semanticCommits: "disabled",
    },
    {
      repository: "gitlab-renovate-forks/gitlab-development-kit",
      ...baseConfig,
      assignees: ["@ashmckenzie", "@tigerwnz", "@toon"],
      enabledManagers: ["npm", "bundler"],
      packageRules: [
        {
          schedule: ["before 05:00 on Monday"],
          matchPackagePatterns: [".+"],
          rangeStrategy: "bump",
          matchManagers: ["bundler"],
          groupName: "Ruby dependencies",
        },
      ],
    },
    {
      repository: "gitlab-renovate-forks/gitaly",
      ...baseConfig,
      labels: [
        "group::gitaly",
        "devops::create",
        "section::dev",
        "type::maintenance",
        "maintenance::dependency",
      ],
      rangeStrategy: "bump",
      semanticCommits: "disabled",
      stabilityDays: 7,
      prCreation: "not-pending",
      enabledManagers: ["bundler", "gomod"],
      includePaths: [
        // Just look in the ruby sub directory
        "ruby/**",
        // and the root directory
        "*",
      ],
      postUpdateOptions: ["gomodTidy"],
      postUpgradeTasks: {
        // Regenerate files that may change due to the dependency updates.
        commands: ["make notice"],
        fileFilters: ["NOTICE"]
      },
      packageRules: [
        updateNothing,
        {
          matchManagers: ["bundler"],
          matchPackageNames: ["gitlab-labkit"],
          enabled: true,
          assignees: ["@pks-t", "@stanhu"],
          commitMessagePrefix: "ruby:",
          groupName: "Ruby dependencies",
        },
        {
          // This is our basic rule for Go packages.
          matchManagers: ["gomod"],
          enabled: true,
          assignees: [
              "@jcaigitlab",
              "@pks-t",
              "@proglottis",
              "@samihiltunen",
              "@toon",
              "@wchandler",
          ],
          // By default, we only use a single assignee for dependencies. Some
          // of the more critical ones follow Gitaly's normal review process
          // and instead require two reviewers.
          assigneesSampleSize: 1,
          commitMessagePrefix: "go:",
          excludePackageNames: [
            // For now, we disable a bunch of Go packages which we know to be
            // out-of-date to lessen the churn. These should be enabled at a
            // later point.
            "github.com/cloudflare/tableflip",
            "github.com/containerd/cgroups",
            "github.com/hashicorp/yamux",
            "github.com/prometheus/client_golang",
            "github.com/rubenv/sql-migrate",
            "github.com/uber/jaeger-client-go",
            "gitlab.com/gitlab-org/gitlab-shell",
            "gitlab.com/gitlab-org/labkit",
            "gocloud.dev",
          ],
        },
        {
          // golang.org/x/ packages don't use releases, but instead use a
          // master-based development workflow. We don't want to upgrade on
          // every new commit though to avoid needless churn, so we just make
          // sure to update once per month.
          matchManagers: ["gomod"],
          matchPackagePrefixes: [
              "golang.org/x/",
          ],
          schedule: ["on the first day of the month"],
        },
        {
          matchManagers: ["gomod"],
          matchPackagePrefixes: ["github.com/jackc/"],
          assigneesSampleSize: 2,
          groupName: "Postgres dependencies",
        },
        {
          matchManagers: ["gomod"],
          matchPackagePrefixes: [
              "github.com/grpc-ecosystem/",
              "google.golang.org/",
          ],
          assigneesSampleSize: 2,
          groupName: "gRPC dependencies",
        },
      ],
    },
    {
      repository: "gitlab-renovate-forks/gitlab-docs",
      ...baseConfig,
      labels: [
        "Technical Writing",
        "Category:Docs Site",
        "type::maintenance",
        "automation:bot-authored",
      ],
      assignees: [
        "@axil",
        "@eread",
        "@kpaizee",
        "@marcel.amirault",
        "@sarahgerman",
      ],
      assigneesSampleSize: 3,
      enabledManagers: ["npm", "bundler"],
      prConcurrentLimit: 4,
      semanticCommits: "disabled",
      packageRules: [
        {
          matchPackagePatterns: ["bootstrap", "vue"],
          enabled: false,
        },
        {
          schedule: ["before 05:00 on Monday"],
          matchPackagePatterns: [".+"],
          rangeStrategy: "bump",
          matchManagers: ["bundler"],
          groupName: "Ruby dependencies",
        },
        {
          schedule: ["before 05:00 on Monday"],
          matchPackagePatterns: [".+"],
          rangeStrategy: "bump",
          matchManagers: ["npm"],
          groupName: "NodeJS dependencies",
        },
      ],
    },
    {
      repository: "gitlab-renovate-forks/gitlab-vscode-extension",
      ...baseConfig,
      labels: [
        "maintenance::dependency",
        "type::maintenance",
        "group::code review",
        "devops::create",
        "automation:bot-authored",
      ],
      assignees: ["@viktomas"],
      packageRules: [
        {
          ...enableWithBumpStrategy,
          matchPackageNames: ["@types/jest", "jest", "ts-jest", "jest-junit"],
          groupName: "Unit testing",
        },
        {
          ...enableWithBumpStrategy,
          matchPackageNames: [
            "@types/sinon",
            "sinon",
            "mocha",
            "mocha-junit-reporter",
          ],
          groupName: "Integration testing",
        },
        {
          ...enableWithBumpStrategy,
          matchPackageNames: [
            "cross-fetch",
            "graphql-request",
            "graphql",
            "https-proxy-agent",
          ],
          groupName: "Fetch frameworks",
        },
        {
          ...enableWithBumpStrategy,
          matchPackageNames: ["request", "request-promise"],
          groupName: "Legacy fetch frameworks",
        },
        {
          ...enableWithBumpStrategy,
          matchPackageNames: [
            "eslint",
            "eslint-config-airbnb-base",
            "eslint-config-prettier",
            "eslint-plugin-import",
            "@typescript-eslint/eslint-plugin",
            "@typescript-eslint/parser",
            "prettier",
          ],
          groupName: "Linting",
        },
        {
          matchPackageNames: ["@types/node", "@types/vscode"],
          enabled: false,
        },
      ],
    },
  ],
};
