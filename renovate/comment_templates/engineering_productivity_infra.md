This Merge Request has been created with the help of [renovate-gitlab-bot] project.

## What are the next steps?

If you have been assigned as a reviewer to this Merge Request,
please review this Merge Request with the same scrutiny as any community contribution:

1. Check out the Upgrade guides in the repo (e.g. [UPGRADE.review-apps.md](https://gitlab.com/gitlab-org/quality/engineering-productivity-infrastructure/-/blob/main/UPGRADE.review-apps.md)) on specific upgrade instructions.

1. If you are reviewing a helm chart upgrade, [you can compare two versions of the same chart in artifacthub.io](https://blog.artifacthub.io/blog/helm-template-compare/). Please leave an observation in the MR diff with a link to the helm chart diff ([see an example](https://gitlab.com/gitlab-org/quality/engineering-productivity-infrastructure/-/merge_requests/208#note_1172391326)).

1. Check the output of the `terraform plan` command from the `build-review-apps` and/or the `build-qa-resources` CI jobs.

1. If unsure, assign to another reviewer for confirmation before merging.

1. If all looks good, merge away!

## Troubleshooting

We have assembled some [FAQs] to help reviewers of these kind of merge requests.

<small>

[Improve this message][message_source] – The JSON comment below is for [automation purposes][process].

</small>

[renovate-gitlab-bot]: https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot
[main_context]: https://docs.gitlab.com/ee/ci/merge_request_pipelines/#run-pipelines-in-the-parent-project-for-merge-requests-from-a-forked-project
[message_source]: https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/blob/main/renovate/comment_templates/engineering_productivity_infra.md
[process]: https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/blob/main/docs/process.md

[FAQs]: https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/blob/main/docs/faq.md
