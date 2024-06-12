## What are the next steps?

If you have been assigned as a reviewer to this Merge Request,
please review this Merge Request with the same scrutiny as any community contribution:

1.  Ensure that the dependencies updated meet our standards:

    - _Security_: Dependencies do not contain malicious code
    - _Performance_: Dependencies do not bloat the application code or prolong CI times unnecessarily
    - _Stability_: Pipelines are passing

2.  Review the changes introduced by the version upgrade. Consider using https://my.diffend.io to compare the two versions in case the updated dependency is either a Ruby Gem or a Node.js package, for example to [compare `pg_query` `2.1.0` and `2.1.4`](https://my.diffend.io/gems/pg_query/2.1.0/2.1.4).

3. Check if `bundle install` works locally, in the context of GDK.

4.  If tests are passing and you've reviewed the updated dependencies, execute pipelines in the [context of the main project][main_context]

    This MR is created from a fork, therefore not _all_ jobs (e.g. Danger) might have been executed.
    Instead of hitting MWPS right away, you might want to wait until the pipeline you've just triggered finished.

    _Note_: This might not be available in projects, in that case merging right away is an option

5.  Assign the current milestone to the MR

6.  Merge away!

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
