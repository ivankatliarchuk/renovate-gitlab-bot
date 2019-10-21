FROM node:12-alpine AS builder

ADD / /workdir
WORKDIR /workdir

RUN apk add --update --no-cache python make g++

RUN yarn install --production --frozen-lockfile --force

FROM node:12-alpine

RUN apk add --update --no-cache git bash

COPY --from=builder /workdir /workdir

WORKDIR /workdir