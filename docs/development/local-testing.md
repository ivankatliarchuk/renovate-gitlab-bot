# Locally Test Renovate Changes

To test Renovate changes locally, use the test-renovate.sh script located in /scripts.

## Prerequisites

1. Docker.
1. GitLab PAT, [see](https://docs.renovatebot.com/modules/platform/gitlab).
1. GitHub PAT, [see](https://docs.renovatebot.com/modules/platform/github).
1. Renovate json config to test, `renovate.json` in the pwd.

## Steps

1. Fork the target repository.
1. Run the script `./test-renovate.sh`. A usage text is included for specific arguments needed.

## Example `renovate.json` file

```json
{
    "$schema": "https://docs.renovatebot.com/renovate-schema.json",
    "extends": [
        "config:base"
    ],
    "enabledManagers": [
        "custom.regex"
    ],
    "packageRules": [
        {
            "matchPackageNames": [
                "golang-fips/go"
            ],
            "matchManagers": [
                "custom.regex"
            ],
            "allowedVersions": "<1.22.0"
        }
    ],
    "customManagers": [
        {
            "customType": "regex",
            "fileMatch": [
                "ci_files/variables.yml"
            ],
            "matchStrings": [
                "GO_FIPS_VERSION:\\s*\"\\S+\"\\n\\s*GO_FIPS_TAG:\\s*\"(?<currentValue>\\S+)\""
            ],
            "autoReplaceStringTemplate": "GO_FIPS_VERSION: \"{{{newMajor}}}.{{{newMinor}}}.{{{newPatch}}}\"\n  GO_FIPS_TAG: \"{{{newValue}}}\"",
            "depNameTemplate": "golang-fips/go",
            "datasourceTemplate": "github-tags",
            "versioningTemplate": "regex:^go(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)-(?<build>\\d+)-openssl-fips$"
        }
    ]
}
```
