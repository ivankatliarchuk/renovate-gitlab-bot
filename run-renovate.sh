#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

export NODE_OPTIONS="--max-old-space-size=4096"

FAIL=""

function fail {
  FAIL="$FAIL$1\\n"
}

function run_renovate {
  export RENOVATE_CONFIG_FILE="$DIR/renovate/config.js"
  export RENOVATE_DISABLE_FILE_RECURSION=true
  export LOG_LEVEL=info

  # We do not want renovate to have access to our privileged GITLAB_TOKEN
  # Or a privileged NPM_TOKEN
  # For more info see the README
  env -u GITLAB_TOKEN -u NPM_TOKEN \
    node "$DIR/node_modules/renovate/dist/renovate.js" && return 0 || return 1
}

function run_postprocessing {
    node "$DIR/scripts/post-process.js" && return 0 || return 1
}

run_renovate || fail "Execution of renovate failed"

run_postprocessing || fail "Execution of postprocessing failed"

if [ "$FAIL" != "" ]; then
  echo -e "$FAIL"
  exit 1
fi

exit 0
