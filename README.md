# renovate-gitlab-bot

> Currently open MRs can be [found here](https://gitlab.com/dashboard/merge_requests?scope=all&utf8=%E2%9C%93&state=opened&author_username=gitlab-dependency-update-bot)

The bot uses [renovatebot](https://github.com/renovatebot/renovate) to
automatically create MRs for updating dependencies. These merge requests will be opened by an unprivileged account `@gitlab-dependency-update-bot`.

Due to limitations with upstream renovate regarding forked workflows we are maintaining a fork of renovate:
https://gitlab.com/gitlab-org/frontend/renovate-fork

The following repositories are currently being updated automatically.

<!-- rep -->

- [gitlab-renovate-forks/analytics-section/product-analytics/devkit](https://gitlab.com/gitlab-renovate-forks/analytics-section/product-analytics/devkit)
- [gitlab-renovate-forks/auto-build-image](https://gitlab.com/gitlab-renovate-forks/auto-build-image)
- [gitlab-renovate-forks/auto-deploy-image](https://gitlab.com/gitlab-renovate-forks/auto-deploy-image)
- [gitlab-renovate-forks/container-registry](https://gitlab.com/gitlab-renovate-forks/container-registry)
- [gitlab-renovate-forks/customers-gitlab-com](https://gitlab.com/gitlab-renovate-forks/customers-gitlab-com)
- [gitlab-renovate-forks/design.gitlab.com](https://gitlab.com/gitlab-renovate-forks/design.gitlab.com)
- [gitlab-renovate-forks/engineering-productivity-infrastructure](https://gitlab.com/gitlab-renovate-forks/engineering-productivity-infrastructure)
- [gitlab-renovate-forks/gemnasium](https://gitlab.com/gitlab-renovate-forks/gemnasium)
- [gitlab-renovate-forks/gitaly](https://gitlab.com/gitlab-renovate-forks/gitaly)
- [gitlab-renovate-forks/gitlab-agent-ci-image](https://gitlab.com/gitlab-renovate-forks/gitlab-agent-ci-image)
- [gitlab-renovate-forks/gitlab-agent](https://gitlab.com/gitlab-renovate-forks/gitlab-agent)
- [gitlab-renovate-forks/gitlab-development-kit](https://gitlab.com/gitlab-renovate-forks/gitlab-development-kit)
- [gitlab-renovate-forks/gitlab-docs](https://gitlab.com/gitlab-renovate-forks/gitlab-docs)
- [gitlab-renovate-forks/gitlab-elasticsearch-indexer](https://gitlab.com/gitlab-renovate-forks/gitlab-elasticsearch-indexer)
- [gitlab-renovate-forks/gitlab-pages](https://gitlab.com/gitlab-renovate-forks/gitlab-pages)
- [gitlab-renovate-forks/gitlab-shell](https://gitlab.com/gitlab-renovate-forks/gitlab-shell)
- [gitlab-renovate-forks/gitlab-styles](https://gitlab.com/gitlab-renovate-forks/gitlab-styles)
- [gitlab-renovate-forks/gitlab-svgs](https://gitlab.com/gitlab-renovate-forks/gitlab-svgs)
- [gitlab-renovate-forks/gitlab-ui](https://gitlab.com/gitlab-renovate-forks/gitlab-ui)
- [gitlab-renovate-forks/gitlab-vscode-extension](https://gitlab.com/gitlab-renovate-forks/gitlab-vscode-extension)
- [gitlab-renovate-forks/gitlab-zoekt-indexer](https://gitlab.com/gitlab-renovate-forks/gitlab-zoekt-indexer)
- [gitlab-renovate-forks/gitlab.vim](https://gitlab.com/gitlab-renovate-forks/gitlab.vim)
- [gitlab-renovate-forks/gitlab](https://gitlab.com/gitlab-renovate-forks/gitlab)
- [gitlab-renovate-forks/helm-install-image](https://gitlab.com/gitlab-renovate-forks/helm-install-image)
- [gitlab-renovate-forks/package-hunter-cli](https://gitlab.com/gitlab-renovate-forks/package-hunter-cli)
- [gitlab-renovate-forks/pajamas-adoption-scanner](https://gitlab.com/gitlab-renovate-forks/pajamas-adoption-scanner)
- [gitlab-renovate-forks/status-page](https://gitlab.com/gitlab-renovate-forks/status-page)
- [gitlab-renovate-forks/terraform-images](https://gitlab.com/gitlab-renovate-forks/terraform-images)
- [gitlab-renovate-forks/terraform-provider-gitlab](https://gitlab.com/gitlab-renovate-forks/terraform-provider-gitlab)
- [gitlab-renovate-forks/triage-ops](https://gitlab.com/gitlab-renovate-forks/triage-ops)
- [gitlab-renovate-forks/version.gitlab.com](https://gitlab.com/gitlab-renovate-forks/version.gitlab.com)

<!-- rep -->

For more details, refer to our documentation:

- [Process](./docs/process.md) describing how our update flow works
- [Setting up a new project](./docs/setting-up-a-new-project.md)
