import { basename, dirname } from "node:path";

const BASE_IMAGE_NAME = process.env.BASE_IMAGE ?? "renovate:latest";

/**
 * Serializes the actual job executing renovate
 */
export function serializeExecutionJob(file, baseName, imageName) {
  const jobName = basename(file, ".config.js")
    .replace(/\W/g, "-")
    .replace(/-+/g, "-");

  return {
    jobName,
    jobDefinition: {
      extends: [".beep-boop"],
      image: imageName,
      stage: basename(dirname(file)),
      variables: {
        CONFIG_FILE: file,
      },
      needs: [
        {
          pipeline: "$PARENT_PIPELINE_ID",
          job: "execution-plan",
          artifacts: true,
        },
        {
          job: baseName,
          optional: true,
        },
      ],
    },
  };
}

function jobNameFromTools(tools) {
  return []
    .concat(tools.filter((x) => x.startsWith("nodejs")))
    .concat(tools.filter((x) => !x.startsWith("nodejs")).sort())
    .join("-");
}

/**
 * Serialize the job building the renovate image
 */
export function serializeBuildImageJob(needToBeInstalled) {
  const jobName = jobNameFromTools(needToBeInstalled);
  const imageName = BASE_IMAGE_NAME.replace(
    "renovate:",
    `renovate-${jobName}:`
  );
  return {
    jobName,
    imageName,
    jobDefinition: {
      extends: [".build-image"],
      stage: "build",
      variables: {
        DOCKER_FILE: `docker_files/${jobName}.Dockerfile`,
        DOCKER_IMAGE: imageName,
      },
    },
  };
}
