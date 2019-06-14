FROM node:10-stretch

ADD / /workdir
WORKDIR /workdir

RUN yarn install --ignore-optional --production --frozen-lockfile && \
    cd node_modules/renovate && \
    yarn install --ignore-optional && \
    yarn run build && \
    rm -rf node_modules && \
    cd ../.. && \
    yarn install --ignore-optional --production --frozen-lockfile && \
    yarn cache clean
