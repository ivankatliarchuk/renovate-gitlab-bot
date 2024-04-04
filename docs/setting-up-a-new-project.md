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
2. Add a renovate [config for your project](../renovate/).

3. Once your MR pipeline runs, review the Terraform Plan job and ensure the changes are expected.

4. Run the manual Terraform Apply job - this will fork your repo. You may need to re-run subsequent pipeline jobs which probably failed due to the fork not existing when they originally ran. This job will fail with permission restrictions if triggered by roles less than maintainer. So [ask a maintainer](https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/project_members?with_inherited_permissions=exclude) to run it for you in case you are not one. Once applied, the MR should be merged asap because it'll cause a state difference towards the default branch. Other pipelines may fail because of that.

5. In the **execute -> Projects -> Your project** job, you can download and check the `renovate-log.txt` job artifact to see that Renovate did what you expected.

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

The Renovate bot runs a pipeline every time a dependency is updated (see the [renovate process docs](https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/blob/main/docs/process.md)). If the new dependency version contains a vulnerability, the pipeline could be compromised and leak the secrets. For this reason, don't add secrets to your renovate fork CI variables unless they are OK to be leaked. Your project should rely on [GitLab Merge Trains](https://docs.gitlab.com/ee/ci/pipelines/merge_trains.html) to prevent merging MRs with failing E2E tests.

[example mr]: https://gitlab.com/gitlab-org/quality/engineering-productivity-infrastructure/-/merge_requests/185
[example comment]: https://gitlab.com/gitlab-org/quality/engineering-productivity-infrastructure/-/merge_requests/185#note_1154622709
