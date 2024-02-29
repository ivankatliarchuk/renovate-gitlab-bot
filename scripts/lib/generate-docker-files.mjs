import { mapToolsToDockerImage } from "./docker-registry.mjs";
import { writeFile } from "node:fs/promises";

const buildRenovateInstructions = (image) => `
FROM ${image} AS builder

ADD / /workdir
WORKDIR /workdir

ENV DOCKER_BUILD=true

RUN apk add --update --no-cache python3 make g++ git

RUN sh scripts/build_renovate.sh`;
const COPY_RENOVATE_INSTRUCTIONS = `
# Copy node and renovate from builder image
COPY --from=builder /workdir /workdir
COPY --from=builder /usr/local/bin/node /usr/local/bin/node
COPY --from=builder /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=builder /usr/local/include/node /usr/local/lib/node
COPY --from=builder /opt/yarn-* /opt/yarn

ENV PATH=/opt/yarn/bin:\${PATH}

RUN node -v && cd /usr/local/bin/ \\
  && ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \\
  && ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \\
  && ln -s /opt/yarn/bin.yarn /usr/local/bin/yarn \\
  && echo "node: $(node -v)" \\
  && echo "npm: $(npm -v)" \\
  && echo "npx: $(npx -v)" \\
  && echo "yarn: $(yarn -v)"
`;
const buildGoLangInstructions = (goImage, targetImage) => {
  if (!goImage) {
    return [];
  }
  if (goImage === targetImage) {
    return [];
  }
  return [
    `FROM ${goImage} as golang`,
    `
# Add ca-certificates for golang
RUN apk add --update --no-cache ca-certificates
# Copy over golang
COPY --from=golang /usr/local/go /usr/local/go

ENV PATH /usr/local/go/bin:$PATH

ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" \\
  && chmod -R 777 "$GOPATH" \\
  && echo "golang: $(go version)"
`,
  ];
};
const UPDATE_GEM_INSTRUCTIONS = `
RUN gem update --system \\
  && gem install rubocop \\
  && echo "ruby: $(ruby -v)" \\
  && echo "gem: $(gem -v)" \\
  && echo "rubocop: $(ruby -v)" \\
  && echo "bundler: $(bundler -v)"
`;

export async function serializeDockerFile(config) {
  const { tools, path } = config;
  const images = await mapToolsToDockerImage(tools);

  console.log(tools, images);

  const targetImage = images.ruby ?? images.golang ?? images.alpine;

  const [GO_SRC_INSTRUCTIONS, COPY_GO_INSTRUCTIONS] = buildGoLangInstructions(
    images.golang,
    targetImage
  );

  const dockerFile = [
    buildRenovateInstructions(images.nodejs),
    GO_SRC_INSTRUCTIONS,
    `
FROM ${targetImage}

# Install some build tools needed, e.g. for gitaly and sanity
# And the newest git version available.
RUN apk add --update --no-cache \\
  bash gnupg make cmake g++ curl pkgconf \\
  && apk add --update --no-cache \\
  --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main \\
  git

# Install Terraform
ENV TERRAFORM_VERSION=1.7.4
RUN cd /tmp && \
      wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip \\
      && wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_SHA256SUMS \\
      && wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_SHA256SUMS.sig \\
      && wget -qO- https://www.hashicorp.com/.well-known/pgp-key.txt | gpg --import \\
      && gpg --verify terraform_${TERRAFORM_VERSION}_SHA256SUMS.sig terraform_${TERRAFORM_VERSION}_SHA256SUMS \\
      && grep terraform_${TERRAFORM_VERSION}_linux_amd64.zip terraform_${TERRAFORM_VERSION}_SHA256SUMS | sha256sum -c \\
      && unzip /tmp/terraform_${TERRAFORM_VERSION}_linux_amd64.zip -d /tmp \\
      && mv /tmp/terraform /usr/local/bin/terraform \\
      && rm -f /tmp/terraform_${TERRAFORM_VERSION}_linux_amd64.zip terraform_${TERRAFORM_VERSION}_SHA256SUMS ${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_SHA256SUMS.sig
`,
    images.ruby ? UPDATE_GEM_INSTRUCTIONS : false,
    COPY_GO_INSTRUCTIONS,
    COPY_RENOVATE_INSTRUCTIONS,
    `WORKDIR /workdir`,
  ]
    .filter(Boolean)
    .join("\n");

  return writeFile(path, dockerFile, "utf-8");
}
