#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

CONFIG_FILE="$1"

export NODE_OPTIONS="--max-old-space-size=4096"
case "${CI_COMMIT_REF_SLUG:-not_main}" in
 main) export DRY_RUN="false" ;;
    *) export DRY_RUN="true" ;;
esac

FAIL=""

function fail {
  FAIL="$FAIL$1\\n"
}

function run_renovate {
  export RENOVATE_CONFIG_FILE="$1"
  export RENOVATE_DISABLE_FILE_RECURSION=true
  export LOG_LEVEL=info

  echo "Using binary source method $BINARY_SOURCE"

  # We do not want renovate to have access to our privileged GITLAB_TOKEN
  # Or a privileged NPM_TOKEN
  # For more info see the README
  env -u GITLAB_TOKEN -u NPM_TOKEN -u BINARY_SOURCE \
    node "$DIR/node_modules/renovate/dist/renovate.js" && return 0 || return 1
}

function run_preprocessing {
    node "$DIR/scripts/pre-process.js" "$@" && return 0 || return 1
}

function run_postprocessing {
    node "$DIR/scripts/post-process.js" "$@" && return 0 || return 1
}

echo "Starting renovate for $DIR/$CONFIG_FILE"

run_preprocessing "$DIR/$CONFIG_FILE" || fail "Execution of preprocessing failed"

run_renovate "$DIR/$CONFIG_FILE" || fail "Execution of renovate for $file failed"

run_postprocessing "$DIR/$CONFIG_FILE" || fail "Execution of postprocessing failed"

if [ "$FAIL" != "" ]; then
  echo -e "$FAIL"
  exit 1
fi

exit 0
