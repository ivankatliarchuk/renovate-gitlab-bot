## What are the next steps?

If you have been assigned as a reviewer to this Merge Request,
please review this Merge Request with the same scrutiny as any community contribution:

1. Ensure that the dependencies updated meet our standards:

    - _Security_: Dependencies do not contain malicious code
    - _Performance_: Dependencies do not bloat the application code or prolong CI times unnecessarily
    - _Stability_: Pipelines are passing (see note below)

2. Review the changes introduced by the version upgrade. Consider using a tool like [container-diff](https://github.com/GoogleContainerTools/container-diff) to compare the two versions.

3. Run `docker-compose pull` and `docker-compose up` locally and check functionality works as expected, in the context of GDK.

4. The pipeline for this MR runs against the forked project, and will fail due to missing CI/CD variables. Once you've reviewed the updated dependencies, execute the pipeline in the [context of the main project][main_context]

    Instead of hitting MWPS right away, you might want to wait until the pipeline you've just triggered finished.

5.  Merge away!

## Updating production

Once this update has been tested and merged, please consider opening a MR on the production [analytics-stack](https://gitlab.com/gitlab-org/analytics-section/product-analytics/analytics-stack/) project, to ensure our production dependencies are updated in sync.

_Note: analytics-stack is a private project which is why we don't have this RenovateBot workflow running against it._

## Troubleshooting

We have assembled some [FAQs] to help reviewers of these kind of merge requests.

<small>

[Improve this message][message_source] – The JSON comment below is for [automation purposes][process].

</small>

[renovate-gitlab-bot]: https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot
[main_context]: https://docs.gitlab.com/ee/ci/pipelines/merge_request_pipelines.html#run-pipelines-in-the-parent-project
[message_source]: https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/blob/main/renovate/comment_templates/default.md
[process]: https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/blob/main/docs/process.md

[FAQs]: https://gitlab.com/gitlab-org/frontend/renovate-gitlab-bot/-/blob/main/docs/faq.md
