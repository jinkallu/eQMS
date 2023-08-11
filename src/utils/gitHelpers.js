import { getClient } from "azure-devops-extension-api";
import { GitRestClient } from "azure-devops-extension-api/Git";
import { markedToHtml } from "../utils/markedHelper";

export const createBranch = async ({
  projectId,
  repositoryId,
  baseBranch,
  newBranch,
}) => {
  console.log(projectId, repositoryId, baseBranch, newBranch);
  let created = false;

  try {
    const gitClient = getClient(GitRestClient);
    const baseBranchRef = await gitClient.getRefs(
      repositoryId,
      projectId,
      `heads/${baseBranch}`
    );

    if (baseBranchRef.length === 0) {
      throw new Error(`Base branch "${baseBranch}" not found.`);
    }

    const newBranchRef = {
      name: `refs/heads/${newBranch}`,
      oldObjectId: "0000000000000000000000000000000000000000",
      newObjectId: baseBranchRef[0].objectId,
    };

    const result = await gitClient.updateRefs(
      [newBranchRef],
      repositoryId,
      projectId
    );
    console.log(result);

    if (result.every((refUpdate) => refUpdate.success)) {
      created = true;
    } else {
      created = false;
      throw new Error(`Failed to create branch "${newBranch}".`);
    }
    return created;
  } catch (error) {
    console.log(error);
    created = false;
    return created;
  }
};

export const getFileContent = async (repositoryId, path, branchName) => {
  const versionDescriptor = {
    version: branchName,
    versionType: 0,
  };
  try {
    const gitClient = getClient(GitRestClient);

    const content = await gitClient.getItemText(
      repositoryId,
      path,
      null,
      undefined, // scopepath
      undefined, // recursionLevel
      undefined, // includeContentMetadata,
      true, // latestProcessedChange
      false, // download
      versionDescriptor
    );

    return content;
  } catch (e) {
    console.log(e);
    return false;
  }
};
