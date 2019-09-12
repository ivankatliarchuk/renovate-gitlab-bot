FROM node:12-alpine AS builder

ADD / /workdir
WORKDIR /workdir

RUN apk add --update --no-cache python make g++

RUN yarn install --production --frozen-lockfile --force

FROM node:12-alpine as app

COPY --from=builder /workdir /workdir

WORKDIR /workdir