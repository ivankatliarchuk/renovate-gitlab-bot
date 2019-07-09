#!/usr/bin/env bash
export RENOVATE_CONFIG_FILE="./config.js"
export RENOVATE_DISABLE_FILE_RECURSION=true

export NODE_OPTIONS="--max-old-space-size=4096"
node ./node_modules/renovate/dist/renovate.js
