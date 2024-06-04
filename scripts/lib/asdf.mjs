import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { GitLabAPI } from "../../bot_image/lib/api.mjs";
import semver from "semver";

const TOOL_VERSION = join(
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

function pathToFile(path, file) {
  return encodeURIComponent(path.replace("*", file));
}

const toolVersionsCache = {};

async function getToolVersionsFromRepository(repository, path = "*") {
  const key = `${repository}|${path}`;
  if (toolVersionsCache[key]) {
    return toolVersionsCache[key];
  }

  try {
    const { data } = await GitLabAPI.get(
      `/projects/${encodeURIComponent(
        repository
      )}/repository/files/${pathToFile(path, ".tool-versions")}/raw`,
      {
        params: {
          ref: "HEAD",
        },
      }
    );
    toolVersionsCache[key] = parseToolVersion(data);
  } catch (e) {
    toolVersionsCache[key] = {};
  }
  return toolVersionsCache[key];
}

/**
 * Some projects do not define tool versions. In this case,
 * we just get the versions defined in the GDK
 */
async function getToolVersionsFallbackGDK() {
  return getToolVersionsFromRepository("gitlab-org/gitlab-development-kit");
}

/**
 * Some projects do not define tool versions and are not present
 * in the GDK .tools-version file. Fallback to the GitLab project.
 */
async function getToolVersionsFallbackGitlab() {
  return getToolVersionsFromRepository("gitlab-org/gitlab");
}

async function getGolangFromGoMod(repository, path = "*") {
  try {
    const { data } = await GitLabAPI.get(
      `/projects/${encodeURIComponent(
        repository
      )}/repository/files/${pathToFile(path, "go.mod")}/raw`,
      {
        params: {
          ref: "HEAD",
        },
      }
    );
    return data
      .split(/[\r\n]+/)
      .find((line) => line.match(/^go\s+(\d+\.\d+)$/))
      ?.split(/\s+/)?.[1];
  } catch (e) {
    return false;
  }
}

async function getGradleVersionFromProperties(repository, path) {
  try {
    const { data } = await GitLabAPI.get(
      `/projects/${encodeURIComponent(
        repository
      )}/repository/files/${pathToFile(path, "gradle.properties")}/raw`,
      {
        params: {
          ref: "HEAD",
        },
      }
    );
    const entries = data
      .split(/[\r\n]+/)
      .filter((line) => !line.match(/^\s*#/))
      .filter((line) => line.includes("="))
      .map((line) => line.split(/\s*=\s*/).map((x) => x.trim()));

    const properties = Object.fromEntries(entries);

    return {
      gradle: properties["gradle.version"],
      jdk: properties["platform.java.version"],
    };
  } catch (e) {
    return false;
  }
}

async function getToolVersionWithFallBack(repositoryConfig, tool) {
  const { repository, includePaths = ["*"] } = repositoryConfig;

  if (repository) {
    for (let path of includePaths) {
      if (path.includes("**")) {
        path = "*";
      }
      const toolVersion = (
        await getToolVersionsFromRepository(repository, path)
      )[tool]?.[0];
      if (toolVersion) {
        return toolVersion;
      }
      if (tool === "golang") {
        const golangVersion = await getGolangFromGoMod(repository, path);
        if (golangVersion) {
          return golangVersion;
        }
      }
      if (tool === "gradle") {
        const gradleVersion = await getGradleVersionFromProperties(
          repository,
          path
        );
        if (gradleVersion) {
          return gradleVersion;
        }
      }
    }
  }

  // Fallback to GDK version if present
  const gdkVersion = (await getToolVersionsFallbackGDK())[tool]?.[0];
  if (gdkVersion) {
    return gdkVersion;
  }

  // If not defined in repo or GDK, try GitLab
  return (await getToolVersionsFallbackGitlab())[tool]?.[0];
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
export async function consolidateVersion(repositoryConfig, tool) {
  let version = await getToolVersionWithFallBack(repositoryConfig, tool);
  let retVersion = version;
  switch (tool) {
    case "golang":
      version = semver.coerce(version);
      retVersion = semver.major(version) + "." + semver.minor(version);
      break;
    case "gradle":
      const jdk = semver.coerce(version.jdk);
      version = semver.coerce(version.gradle + "-jdk" + jdk.major);
      retVersion =
        semver.major(version) +
        "." +
        semver.minor(version) +
        "-jdk" +
        jdk.major;
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
