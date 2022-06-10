#!/usr/bin/env sh

if ! [ -d renovate-fork ]; then
  git clone https://gitlab.com/gitlab-org/frontend/renovate-fork.git
fi

cd renovate-fork || exit 1
git fetch
git checkout gitlab-main-v28
git pull
yarn install
yarn build
yarn pack
mv ./renovate*.tgz ../renovate-fork.tgz
cd .. || exit 1

yarn install --production --frozen-lockfile --force

if [ "$DOCKER_BUILD" = "true" ]; then
  echo "Cleaning up the renovate-fork source files"
  rm -rf renovate-fork renovate-fork.tgz
fi
