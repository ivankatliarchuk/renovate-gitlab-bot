#!/usr/bin/env bash
export RENOVATE_CONFIG_FILE="./config.js"
export RENOVATE_TOKEN=ksk3hZZLMwDdS1NHxe99
export RENOVATE_DISABLE_FILE_RECURSION=true

yarn install --ignore-optional
# PATH=$PATH:$PWD/node_modules/.bin
cd node_modules/renovate
yarn install --ignore-optional
yarn run build
cd ../..
node node_modules/renovate/dist/renovate.js
