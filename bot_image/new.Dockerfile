FROM ghcr.io/containerbase/buildpack AS builder

ADD / /workdir
WORKDIR /workdir

ENV DOCKER_BUILD=true

RUN install-tool git v2.39.1
RUN install-tool node 16.19.0
RUN install-tool yarn 1.22.19
RUN install-apt python3 make g++

RUN sh scripts/build_renovate.sh

FROM ghcr.io/containerbase/buildpack

RUN install-tool git v2.39.1
RUN install-tool node 16.19.0
RUN install-tool yarn 1.22.19
# Install some build tools needed, e.g. for gitaly and sanity
RUN install-apt \
  bash make cmake g++ curl \
  # Add ca-certificates for golang
  ca-certificates

# Copy node and renovate from builder image
COPY --from=builder /workdir /workdir

# Dump versions
RUN echo "node: $(node -v)" \
  && echo "npm: $(npm -v)" \
  && echo "npx: $(npx -v)" \
  && echo "yarn: $(yarn -v)"

WORKDIR /workdir
