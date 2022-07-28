FROM node:16-alpine3.15 AS builder

ADD / /workdir
WORKDIR /workdir

ENV DOCKER_BUILD=true

RUN apk add --update --no-cache python3 make g++ git

RUN sh scripts/build.sh

FROM golang:1.17-alpine3.15 as golang

FROM ruby:2.7.6-alpine3.15

# Copy node and renovate from builder image
COPY --from=builder /workdir /workdir
COPY --from=builder /usr/local/bin/node /usr/local/bin/node
COPY --from=builder /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=builder /usr/local/include/node /usr/local/lib/node
COPY --from=builder /opt/yarn-* /opt/yarn

ENV PATH=/opt/yarn/bin:${PATH}

RUN apk add --update --no-cache git bash make cmake g++ curl \
  && node -v && cd /usr/local/bin/ \
  && ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
  && ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
  && ln -s /opt/yarn/bin.yarn /usr/local/bin/yarn \
  && yarn -v && npm -v && npx -v

# Needed for go
RUN apk add --no-cache ca-certificates
COPY --from=golang /usr/local/go /usr/local/go

ENV PATH /usr/local/go/bin:$PATH

ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" \
  && chmod -R 777 "$GOPATH" \
  && go version

WORKDIR /workdir
