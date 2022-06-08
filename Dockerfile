FROM node:16-alpine3.15 AS builder

ADD / /workdir
WORKDIR /workdir

ENV DOCKER_BUILD=true

RUN apk add --update --no-cache python3 make g++ git

RUN sh scripts/build.sh

FROM ruby:2.7.6-alpine3.15

COPY --from=builder /workdir /workdir
COPY --from=builder /usr/local/bin/node /usr/local/bin/node
COPY --from=builder /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=builder /usr/local/include/node /usr/local/lib/node
COPY --from=builder /opt/yarn-* /opt/yarn

ENV PATH=/opt/yarn/bin:${PATH}

RUN apk add --update --no-cache git bash \
  && node -v && cd /usr/local/bin/ \
  && ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
  && ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
  && ln -s /opt/yarn/bin.yarn /usr/local/bin/yarn \
  && yarn -v && npm -v && npx -v

WORKDIR /workdir
