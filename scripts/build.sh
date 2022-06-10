#!/usr/bin/env sh

FORK_BRANCH=gitlab-main-v31

if ! [ -d renovate-fork ]; then
  git clone https://gitlab.com/gitlab-org/frontend/renovate-fork.git
fi

rm -f renovate*.tgz

cd renovate-fork || exit 1
git fetch
git checkout "$FORK_BRANCH"
git pull
yarn install
yarn build
yarn pack
mv ./renovate*.tgz "../renovate-fork-$FORK_BRANCH.tgz"
cd .. || exit 1

if [ "$DOCKER_BUILD" = "true" ]; then
  yarn install --production --frozen-lockfile --force
  echo "Cleaning up the renovate-fork source files"
  rm -rf renovate-fork renovate*.tgz
else
  yarn add "renovate@file:./renovate-fork-$FORK_BRANCH.tgz"
  sed -r 's_(file:./renovate.+.tgz)#.+"_\1"_' yarn.lock > yarn.tmp
  mv -f yarn.tmp yarn.lock
  yarn install --force
fi
