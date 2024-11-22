# Setting up a new project

Submit a Merge Request containing the following two changes:

1. Add your project to [`forks/config.tfvars`](forks/config.tfvars), e.g.:

    ```diff
     projects = [
       ...
       "gitlab-org/terraform-provider-gitlab",
    +  "<PATH WITH NAMESPACE TO YOUR NEW PROJECT>"
     ]
    ```
2. Create a merge request that only adds your project. This is so that other merge requests won't fail because their config mismatches the state.

3. Review the OpenTofu plan from the `plan` job and ensure the changes are expected.
   Ask for a review and make sure the person merging the MR applies to manual OpenTofu `apply` job on the default branch once merged.

4. Add a renovate [config for your project](../renovate/). Have a look at the [considerations section](#considerations) if this is your first time setting up renovate for a project.
   In the **execute -> Projects -> Your project** job, you can download and check the `renovate-log.txt` job artifact to see that Renovate did what you expected.

5. Create another merge request with that configuration, review and get it merged.

## Considerations

1. Do you have a CI step that to validate that your commits message align with [GitLab commit messages guidelines](https://docs.gitlab.com/ee/development/contributing/merge_request_workflow.html#commit-messages-guidelines)?
   * Yes, consider setting [semanticCommits](https://docs.renovatebot.com/configuration-options/#semanticcommits) to `"disabled"`.
   * No, you can ignore this setting.
2. Are you working on a project where keeping the merge request queue clean is important?
   * Yes, consider settings [prConcurrentLimit](https://docs.renovatebot.com/configuration-options/#prconcurrentlimit) to a low number that your team is able to handle.
   * No, you can ignore this setting.
3. Have you set aside time to handle to high amount of dependencies merge requests after the bot is installed?
   * No, consider increasing the weight of your dependabot setup issue as it may take more than a day to handle the dependencies update. Also consider spreading the message to *ur team to devide and conquer the merge requests.
   * Yes, you're all set.

## Implementation Details

The CI/CD pipeline in this project will import your project to the [gitlab-renovate-forks](https://gitlab.com/gitlab-renovate-forks) group
and setup a pull mirror to the upstream repository using the [GitLab Terraform Provider](https://gitlab.com/gitlab-org/terraform-provider-gitlab).

## Update the comment from renovate

Renovate creates a merge request for each tool that needs to be updated (see an [example MR]).
Inside the merge request, Renovate will [post a comment][example comment] to explain the procedure to review the merge request.
By default, renovate uses [this default template for the comment](../renovate/comment_templates/default.md).

You have the possibility to use your own comment for your project with renovate.
As an example, see [the `renovateMetaCommentTemplate` usage in this project config](../renovate/projects/engineering-productivity-infrastructure.config.js).

## CI protected variables (secrets) and renovate forks

The Renovate bot runs a pipeline every time a dependency is updated (see the [renovate process docs](https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/blob/main/docs/process.md)). If the new dependency version contains a vulnerability, the pipeline could be compromised and leak the secrets. For this reason, don't add secrets to your renovate fork CI variables. Your project should rely on [GitLab Merge Trains](https://docs.gitlab.com/ee/ci/pipelines/merge_trains.html) to prevent merging MRs with failing E2E tests. (See [an example of how to configure optional fork jobs](https://gitlab.com/gitlab-org/editor-extensions/gitlab-lsp/-/merge_requests/275).)

[example mr]: https://gitlab.com/gitlab-org/quality/engineering-productivity-infrastructure/-/merge_requests/185
[example comment]: https://gitlab.com/gitlab-org/quality/engineering-productivity-infrastructure/-/merge_requests/185#note_1154622709
