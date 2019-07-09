FROM node:10-stretch

ADD / /workdir
WORKDIR /workdir

RUN yarn install --ignore-optional --production --frozen-lockfile && \
    yarn cache clean
