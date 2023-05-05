import { getVersionRegistry } from "./asdf.mjs";
import semver from "semver";
import axios from "axios";

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

function toolToRepo(tool) {
  if (tool === "nodejs") {
    return "node";
  }
  return tool;
}

/**
 * Maps a list of tools (e.g. ['node-16', 'ruby-3.0.5'] to corresponding docker images
 * with matching alpine versions
 */
export async function mapToolsToDockerImage(toolsRaw) {
  const tools = toolsRaw.map((x) => getVersionRegistry()[x]);
  let alpineVersion = semver.coerce(ALPINE_MIN_VERSION);
  alpineVersion: while (
    await imageExists("alpine", alpineVersion.major + "." + alpineVersion.minor)
  ) {
    const alpine = alpineVersion.major + "." + alpineVersion.minor;

    const ret = {
      alpine: `alpine:${alpine}`,
    };

    for (const [tool, exact, minor] of tools) {
      const repository = toolToRepo(tool);
      if (await imageExists(repository, `${exact}-alpine${alpine}`)) {
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
