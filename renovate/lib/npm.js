const GITLAB_UI_PACKAGE = "@gitlab/ui";
const GITLAB_SVGS_PACKAGE = "@gitlab/svgs";

/**
 * Group updates of jest into one MR
 */
const prJest = {
  matchPackageNames: ["jest", "jest-environment-jsdom", "jest-circus"],
  enabled: true,
  groupName: "Jest",
};

/**
 * Group updates of all babel packages into one MR
 */
const prBabel = {
  matchPackagePatterns: ["@babel.+"],
  enabled: true,
  groupName: "Babel",
};

/**
 * Update vue, template compiler and server renderer to latest Major 2 version
 */
const prVueMajor2 = {
  matchPackageNames: ["vue", "vue-template-compiler", "vue-server-renderer"],
  rangeStrategy: "bump",
  allowedVersions: "<3",
  enabled: true,
  groupName: "Vue",
};

/**
 * Update GitLab UI and GitLab SVGs
 */
const prGitLabUISVG = {
  enabled: true,
  matchPackageNames: [GITLAB_UI_PACKAGE, GITLAB_SVGS_PACKAGE],
  groupName: "GitLab UI/SVG",
};

/**
 * Update GitLab UI
 */
const prGitLabUI = {
  enabled: true,
  matchPackageNames: [GITLAB_UI_PACKAGE],
  // Legacy name, not changed yet in order not to cause any disruptions
  // with pending MRs
  groupName: "GitLab UI/SVG",
};

/**
 * Update GitLab SVGs
 */
const prGitLabSVG = {
  enabled: true,
  matchPackageNames: [GITLAB_SVGS_PACKAGE],
};

/**
 * Update eslint and related packages, but _not_ our own @gitlab/eslint-plugin
 */
const prEslint = {
  enabled: true,
  matchPackageNames: ["eslint"],
  matchPackagePatterns: ["eslint-.+"],
  excludePackageNames: ["@gitlab/eslint-plugin"],
  groupName: "ESLint and related",
};

/**
 * Update stylelint and related packages
 */
const prStylelint = {
  enabled: true,
  matchPackageNames: ["@gitlab/stylelint-config"],
  matchPackagePatterns: ["stylelint-.+"],
  reviewers: ["vitallium", "pgascouvaillancourt"],
  groupName: "Stylelint and related",
};

/**
 * Update GitLab package, catchall
 */
const prGitLabCatchall = {
  enabled: true,
  matchPackagePatterns: ["@gitlab/.*"],
  excludePackageNames: [
    GITLAB_UI_PACKAGE,
    GITLAB_SVGS_PACKAGE,
    ...prStylelint.matchPackageNames,
  ],
  groupName: "GitLab Packages",
};

/**
 * Update all `@gitlab/` packages and eslint, styleline related packages
 * @type {Array}
 */
const prGitLabScopeAndLinters = [
  // The catch-all is placed top-most, in order to be able to overwrite it later
  // on with more specific rules
  prGitLabCatchall,
  prGitLabUISVG,
  prEslint,
  prStylelint,
];

/**
 * Update dompurify
 */
const updateDOMPurify = {
  matchPackageNames: ["dompurify"],
  rangeStrategy: "bump",
  enabled: true,
  reviewers: ["djadmin", "markrian"],
};

module.exports = {
  prBabel,
  prEslint,
  prJest,
  prStylelint,
  prVueMajor2,
  prGitLabCatchall,
  prGitLabSVG,
  prGitLabUI,
  prGitLabUISVG,
  updateDOMPurify,
  prGitLabScopeAndLinters,
};
