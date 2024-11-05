#!/bin/bash

set -euo pipefail
usage() {
    echo "Usage: $0 [-v <value>] [-p <value>] [-r <value>] [-h]"
    echo "Options:"
    echo "  -p    The json configuration file path."
    echo "  -r    The repo to target on Gitlab in the format \$project/\$repository."
    echo "  -v    The Renovate version to use. This should match the Renovate fork on Gitlab. (Optional) Default: 37.287.2"
    echo "  -d    Perform a dry run without creating the actual MR on Gitlab. (Optional)"
    echo "  -h    Display this help message."
    echo "Note: The following environment variables are required:"
    echo "  GITLAB_TOKEN This PA token allows access to your repo fork on Gitlab."
    echo "  GITHUB_TOKEN This PA token allows installation of the Mend Renovate app from the Github marketplace. Repo permission is required."
}
RENOVATE_VERSION="37.287.2"
RENOVATE_CONFIG_PATH=""
TARGET_REPO=""
RENOVATE_ARGS=""

while getopts "v:p:r:h:d" opt; do
  case ${opt} in
    v )
      RENOVATE_VERSION=$OPTARG
      ;;
    p )
      RENOVATE_CONFIG_PATH=$OPTARG
      ;;
    r )
      TARGET_REPO=$OPTARG
      ;;
    d )
      RENOVATE_ARGS="--dry-run=full"
      ;;
    h )
      usage
      exit 0
      ;;
  esac
done

GITLAB_TOKEN=${GITLAB_TOKEN:?Need to set GITLAB_TOKEN}
GITHUB_TOKEN=${GITHUB_TOKEN:?Need to set GITHUB_TOKEN}

if [ -z "$RENOVATE_VERSION" ]; then
    echo "Renovate version not provided."
    exit 1
fi

if [[ ! -f "$RENOVATE_CONFIG_PATH" ]]; then
    echo "Config file does not exist at specified path."
    exit 1
fi

if [ -z "$TARGET_REPO" ]; then
    echo "Target repository not provided."
    exit 1
fi

RENOVATE_CONFIG_PATH=$(realpath "$RENOVATE_CONFIG_PATH")

echo -e "\nRenovate version: $RENOVATE_VERSION"
echo "Config file: $RENOVATE_CONFIG_PATH"
echo -e "Target repository: $TARGET_REPO\n"

RENOVATE_PLATFORM=${RENOVATE_PLATFORM:-gitlab}
RENOVATE_ONBOARDING=false
RENOVATE_REQUIRE_CONFIG=ignored
LOG_LEVEL=debug
RENOVATE_CONFIG_FILE=/renovate.json
RENOVATE_FORK_PROCESSING=enabled

docker run -it --rm \
    -v "$RENOVATE_CONFIG_PATH:$RENOVATE_CONFIG_FILE" \
    -e RENOVATE_PLATFORM="$RENOVATE_PLATFORM" \
    -e RENOVATE_TOKEN="$GITLAB_TOKEN" \
    -e RENOVATE_ONBOARDING="$RENOVATE_ONBOARDING" \
    -e RENOVATE_REQUIRE_CONFIG="$RENOVATE_REQUIRE_CONFIG" \
    -e LOG_LEVEL="$LOG_LEVEL" \
    -e RENOVATE_CONFIG_FILE="$RENOVATE_CONFIG_FILE" \
    -e GITHUB_COM_TOKEN="$GITHUB_TOKEN" \
    -e RENOVATE_FORK_PROCESSING="$RENOVATE_FORK_PROCESSING" \
    --name renovatebot renovate/renovate:$RENOVATE_VERSION --schedule="" $RENOVATE_ARGS $TARGET_REPO
