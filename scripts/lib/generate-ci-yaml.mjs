/**
 * Serializes the actual job executing renovate
 */
export function serializeExecutionJob(file, baseName, imageName) {
  return {
    extends: [".beep-boop"],
    image: imageName,
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
  };
}

/**
 * Serialize the job building the renovate image
 */
export function serializeBuildImageJob(baseName, image) {
  return {
    extends: [".build-image"],
    variables: {
      DOCKER_FILE: `docker_files/${baseName}.Dockerfile`,
      DOCKER_IMAGE: image,
    },
  };
}

export function jobNameFromTools(tools) {
  return []
    .concat(tools.filter((x) => x.startsWith("nodejs")))
    .concat(tools.filter((x) => !x.startsWith("nodejs")).sort())
    .join("-");
}
