import { getVersionRegistry } from "./asdf.mjs";
import semver from "semver";
import axios from "axios";
import tar from "tar-stream";
import { finished } from "node:stream/promises";
import gunzip from "gunzip-maybe";
import pMemoize from "p-memoize";

const ALPINE_MIN_VERSION = "3.16";

async function imageExists(repository, tag = "latest") {
  console.log(`Checking if ${repository}:${tag} exists`);
  try {
    await axios.head(
      `https://hub.docker.com/v2/repositories/library/${repository}/tags/${tag}`
    );
    return true;
  } catch (e) {
    return false;
  }
}

async function getToken(repository) {
  const { data } = await axios.get(
    `https://auth.docker.io/token?scope=repository:library/${repository}:pull&service=registry.docker.io`
  );
  if (!data.token) {
    throw new Error("Could not get token");
  }
  return data.token;
}

async function getManifest({ repository, tag, token }) {
  const { data } = await axios.get(
    `https://registry-1.docker.io/v2/library/${repository}/manifests/${tag}`,
    {
      headers: {
        accept:
          "application/vnd.oci.repository.manifest.v1+json, application/vnd.docker.distribution.manifest.list.v2+json",
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (
    [
      "application/vnd.oci.repository.index.v1+json",
      "application/vnd.docker.distribution.manifest.list.v2+json",
    ].includes(data.mediaType)
  ) {
    const manifest = data?.manifests?.find((x) => {
      return (
        x.platform?.architecture === "amd64" && x?.platform?.os === "linux"
      );
    });
    if (!manifest) {
      throw new Error(`Could not find amd64 manifest for ${repository}:${tag}`);
    }
    return getManifest({ repository, tag: manifest.digest, token });
  }

  if (
    [
      "application/vnd.oci.repository.manifest.v1+json",
      "application/vnd.docker.distribution.manifest.v2+json",
    ].includes(data.mediaType)
  ) {
    return data;
  }

  throw new Error(`Unhandled media type ${data.mediaType}`);
}

async function extractFromLayer({ repository, digest, token }) {
  const { data: stream } = await axios.get(
    `https://registry-1.docker.io/v2/library/${repository}/blobs/${digest}`,
    {
      responseType: "stream",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  const extract = tar.extract();

  let version = null;

  extract.on("entry", function (header, entityStream, next) {
    entityStream.on("data", (chunk) => {
      if (header.name === "etc/alpine-release") {
        version ||= "";
        version += chunk.toString();
      }
    });

    entityStream.on("end", function () {
      if (header.name === "etc/alpine-release") {
        version = version.trim();
      }
      next(); // ready for next entry
    });

    entityStream.resume(); // just auto drain the stream
  });

  await finished(stream.pipe(gunzip()).pipe(extract));

  return version;
}

const getAlpineVersionFromImage = pMemoize(
  async function getAlpineVersionFromImage(repository, tag = "latest") {
    const token = await getToken(repository);

    const { layers } = await getManifest({ repository, tag, token });
    if (layers[0]) {
      return await extractFromLayer({
        repository,
        digest: layers[0].digest,
        token,
      });
    }
    return null;
  },
  { cacheKey: (args) => args.join(":") }
);

function toolToRepo(tool) {
  if (tool === "nodejs") {
    return "node";
  }
  return tool;
}

/**
 * Memoized function to get
 */
const getAvailableAlpineVersions = pMemoize(
  async function getAvailableAlpineVersions() {
    const validAlpineVersions = [];
    let alpineVersion = semver.coerce(ALPINE_MIN_VERSION);

    while (
      await imageExists(
        "alpine",
        alpineVersion.major + "." + alpineVersion.minor
      )
    ) {
      validAlpineVersions.unshift(semver.parse(alpineVersion.toString()));
      alpineVersion.inc("minor");
    }
    return validAlpineVersions;
  }
);

/**
 * Maps a list of tools (e.g. ['node-16', 'ruby-3.0.5'] to corresponding docker images
 * with matching alpine versions. Highest alpine version is taken.
 */
export async function mapToolsToDockerImage(toolsRaw) {
  const tools = toolsRaw.map((x) => getVersionRegistry()[x]);

  const validAlpineVersions = await getAvailableAlpineVersions();

  alpineVersion: for (const alpineVersion of validAlpineVersions) {
    const alpine = alpineVersion.major + "." + alpineVersion.minor;

    const ret = {
      alpine: `alpine:${alpine}`,
    };

    for (const [tool, exact, minor] of tools) {
      const repository = toolToRepo(tool);
      if (repository === "gradle") {
        const tag = exact + "-alpine";
        const alpineVersionFromImage = await getAlpineVersionFromImage(
          repository,
          tag
        );
        const coerced = semver.coerce(alpineVersionFromImage);
        if (alpine === coerced.major + "." + coerced.minor) {
          ret[tool] = `${repository}:${tag}`;
        } else {
          continue alpineVersion;
        }
      } else if (await imageExists(repository, `${exact}-alpine${alpine}`)) {
        ret[tool] = `${repository}:${exact}-alpine${alpine}`;
      } else if (await imageExists(repository, `${minor}-alpine${alpine}`)) {
        ret[tool] = `${repository}:${minor}-alpine${alpine}`;
      } else {
        console.log(
          `${tool}@${exact} not found for alpine@${alpine}. Skipping to next`
        );
        alpineVersion.inc("minor");
        continue alpineVersion;
      }
    }
    return ret;
  }
  throw new Error(`Could not find shared alpine image for tools: ${toolsRaw}`);
}
