# How to validate changes

After adding a new managed dependency:

1. Download the artifact from the job triggered for the project config you're changing.
1. Extract the json file.
1. Search for the `deps` array which includes your dependency name on the `depName` attribute.
1. Verify that the `fixedVersion` attribute matches your project's current version.
1. If there's a new version upstream. Verify that The `updates: []` array for this dependency has a `newVersion` set which matches with your expectation from upstream.
1. If there's no new version upstream, `updates: []` will be empty. See [how to validate locally and create test MRs](#how-to-validate-locally-and-create-test-mrs).

### How to validate locally and create test MRs

If you'd like to validate a change that has no updates upstream, you can create a fork of the target project, downgrade the version, then follow our instructions on [local testing](local-testing.md).

This approach is also very helpful, if you want to add multiple dependencies at once, as you can quickly create/update MRs. And also if you want to test other aspects of the MR output besides dependency updates.