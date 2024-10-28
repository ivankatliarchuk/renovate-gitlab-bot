#!/bin/bash

set -euo pipefail

GITLAB_TOKEN=${GITLAB_TOKEN:?Need to set GITLAB_TOKEN}
GITHUB_TOKEN=${GITHUB_TOKEN:?Need to set GITHUB_TOKEN}

RENOVATE_PLATFORM=${RENOVATE_PLATFORM:-gitlab}
RENOVATE_ONBOARDING=false
RENOVATE_REQUIRE_CONFIG=ignored
LOG_LEVEL=debug
RENOVATE_CONFIG_FILE=/renovate.json
RENOVATE_FORK_PROCESSING=enabled

# check if renovate.json exists
if [[ ! -f "renovate.json" ]]; then
    echo "renovate.json does not exist"
    exit 1
fi

if [[ -z "$1" ]]; then
    echo "Need to specify an argument, e.g. --dry-run=full org/repo"
    exit 1
fi

docker run -it --rm \
    -v "$(pwd)/renovate.json:/renovate.json" \
    -e RENOVATE_PLATFORM="$RENOVATE_PLATFORM" \
    -e RENOVATE_TOKEN="$GITLAB_TOKEN" \
    -e RENOVATE_ONBOARDING="$RENOVATE_ONBOARDING" \
    -e RENOVATE_REQUIRE_CONFIG="$RENOVATE_REQUIRE_CONFIG" \
    -e LOG_LEVEL="$LOG_LEVEL" \
    -e RENOVATE_CONFIG_FILE="$RENOVATE_CONFIG_FILE" \
    -e GITHUB_COM_TOKEN="$GITHUB_TOKEN" \
    -e RENOVATE_FORK_PROCESSING="$RENOVATE_FORK_PROCESSING" \
    --name renovatebot renovate/renovate --schedule="" $@

