#!/usr/bin/env bash
export RENOVATE_CONFIG_FILE="./config.js"
export RENOVATE_DISABLE_FILE_RECURSION=true

yarn install --ignore-optional
cd node_modules/renovate
yarn run build
cd ../..
node node_modules/renovate/dist/renovate.js
