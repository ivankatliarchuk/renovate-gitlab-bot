#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

FORK_BRANCH=gitlab-main-v37-287

if ! [ -d renovate-fork ]; then
  git clone https://gitlab.com/gitlab-org/frontend/renovate-fork.git
fi

rm -f renovate*.tgz

cd renovate-fork || exit 1
git fetch
git fetch --tags
git checkout "$FORK_BRANCH"
git reset --hard "origin/$FORK_BRANCH"
VERSION=$(git describe --tags)
echo "Renovate Version $VERSION"
corepack enable
rm -rf node_modules
pnpm version --new-version "$VERSION" --no-git-tag-version
pnpm install
pnpm build
pnpm pack
mv ./renovate*.tgz "../renovate-fork-$VERSION.tgz"
git reset --hard "origin/$FORK_BRANCH"
cd .. || exit 1

if [ "${DOCKER_BUILD:-false}" = "true" ]; then
  yarn install --production --frozen-lockfile --force
  echo "Cleaning up the renovate-fork source files and yarn cache"
  rm -rf renovate-fork renovate*.tgz .cache
else
  yarn cache clean
  yarn add "renovate@file:./renovate-fork-$VERSION.tgz"
  sed -r 's_(file:./renovate.+.tgz)#.+"_\1"_' yarn.lock > yarn.tmp
  mv -f yarn.tmp yarn.lock
  yarn install --force
fi
corepack disable
