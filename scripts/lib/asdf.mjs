import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GitLabAPI } from "../../bot_image/lib/api.js";
import semver from "semver";

const TOOL_VERSION = path.join(
  fileURLToPath(import.meta.url),
  "..",
  "..",
  "..",
  ".tool-versions"
);

const versionRegistry = {};

function parseToolVersion(data) {
  return data
    .trim()
    .split(/[\r\n]+/)
    .reduce((acc, line) => {
      if (!line.startsWith("#") && line.trim()) {
        const [tool, ...versions] = line.split(/\s+/);
        acc[tool] = versions;
      }

      return acc;
    }, {});
}

async function getRenovateNodeVersion() {
  if (getRenovateNodeVersion.value) {
    return getRenovateNodeVersion.value;
  }
  const toolVersions = parseToolVersion(await readFile(TOOL_VERSION, "utf-8"));
  return (getRenovateNodeVersion.value = semver.coerce(
    toolVersions["nodejs"][0]
  ));
}

export async function getToolVersionsFromRepository(repository) {
  try {
    const { data } = await GitLabAPI.get(
      `/projects/${encodeURIComponent(
        repository
      )}/repository/files/.tool-versions/raw`,
      {
        params: {
          ref: "HEAD",
        },
      }
    );
    return parseToolVersion(data);
  } catch (e) {
    return {};
  }
}

/**
 * Some projects do not define tool versions. In this case,
 * we just get the versions defined in the GDK
 */
async function getToolVersionsFallback() {
  if (getToolVersionsFallback.value) {
    return getToolVersionsFallback.value;
  }

  return (getToolVersionsFallback.value = getToolVersionsFromRepository(
    "gitlab-org/gitlab-development-kit"
  ));
}

/**
 * This function helps consolidate versions a little bit.
 * Rather than building a matrix of _all_ used node / golang versions,
 * this lumps together all and returns the highest
 * - nodejs@major
 * - golang@major.minor
 *
 * So for example:
 * - node@16.5.0, node@16.12, node@16.0 => node-16
 * - golang@1.18.0, golang@1.18.5, golang@1.18.2 => golang-1.18
 */
export async function consolidateVersion(toolVersions, tool) {
  let version =
    toolVersions[tool]?.[0] ?? (await getToolVersionsFallback())[tool]?.[0];
  let retVersion = version;
  switch (tool) {
    case "golang":
      version = semver.coerce(version);
      retVersion = semver.major(version) + "." + semver.minor(version);
      break;
    case "nodejs":
      const renNodeVersion = await getRenovateNodeVersion();
      version = semver.coerce(version);
      if (semver.lt(version, renNodeVersion)) {
        version = renNodeVersion;
      }
      retVersion = semver.major(version).toString();
      break;
  }
  const key = tool + "-" + retVersion;
  versionRegistry[key] ??= [tool, "0.0.0"];
  if (semver.gt(version, versionRegistry[key][1])) {
    versionRegistry[key] = [tool, version.toString(), retVersion];
  }
  return key;
}

export const getVersionRegistry = () => versionRegistry;
