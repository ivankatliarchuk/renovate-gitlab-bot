#!/usr/bin/env sh
export RENOVATE_CONFIG_FILE="./config.js"
export RENOVATE_DISABLE_FILE_RECURSION=true

export NODE_OPTIONS="--max-old-space-size=4096"
# We do not want renovate to have access to our privileged GITLAB_TOKEN
# For more info see the README
export GITLAB_TOKEN="confidential"
node ./node_modules/renovate/dist/renovate.js
