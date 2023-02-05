# Setting up a new project

You can only do steps 1-3 if you are maintainer of this project, and you've got access to the private 1Password Vault. Otherwise, please contact a maintainer.

1.  Open a private tab or different browser and log in with the
    [@gitlab-renovate-bot](https://gitlab.com/gitlab-renovate-bot) credentials from 1Password.
2.  Locate the project you want to renovate and fork it into the [gitlab-renovate-forks]
3.  Go into the project settings and set up mirroring (Settings -> Repository).

    1. You need to enter the upstream repo
    2. Enable "overwrite diverged branches" (should never happen, but upstream should be the single source of truth)
    3. Enable "only protected branches" which probably helps with performance

    ![](img/mirror-setup.png)

4.  Create an MR which adds your fork to [the config](../renovate).

[gitlab-renovate-forks]: https://gitlab.com/gitlab-renovate-forks

## Update the comment from renovate

Renovate creates a merge request for each tool that needs to be updated (see an [example MR](https://gitlab.com/gitlab-org/quality/engineering-productivity-infrastructure/-/merge_requests/185)). Inside the merge request, Renovate will [post a comment](https://gitlab.com/gitlab-org/quality/engineering-productivity-infrastructure/-/merge_requests/185#note_1154622709) to explain the procedure to review the merge request. By default, renovate uses [this default template for the comment](../renovate/comment_templates/default.md).

You have the possibility to use your own comment for your project with renovate. As an example, see [the `renovateMetaCommentTemplate` usage in this project config](../renovate/projects/engineering-productivity-infrastructure.config.js).
