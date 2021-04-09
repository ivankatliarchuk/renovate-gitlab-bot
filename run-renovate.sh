#!/usr/bin/env sh
export RENOVATE_CONFIG_FILE="./config.js"
export RENOVATE_DISABLE_FILE_RECURSION=true

export NODE_OPTIONS="--max-old-space-size=4096"
# We do not want renovate to have access to our privileged GITLAB_TOKEN
# Or a privileged NPM_TOKEN
# For more info see the README
unset GITLAB_TOKEN
unset NPM_TOKEN

export LOG_LEVEL=info
node ./node_modules/renovate/dist/renovate.js
