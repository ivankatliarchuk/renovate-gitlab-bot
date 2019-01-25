#!/usr/bin/env bash
export RENOVATE_CONFIG_FILE="./config.js"
export RENOVATE_DISABLE_FILE_RECURSION=true

yarn install --ignore-optional
yarn run renovate
