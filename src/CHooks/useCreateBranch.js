import { useState } from "react";
import { getClient } from "azure-devops-extension-api";
import { GitRestClient } from "azure-devops-extension-api/Git";

const useCreateBranch = () => {
  const [loading, setLoading] = useState(false);
  const [branchCreated, setBranchCreated] = useState(false);

  const createBranch = async (
    projectId,
    repositoryId,
    baseBranch,
    newBranch
  ) => {
    setLoading(true);
    setBranchCreated(false);
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
        created = false;
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
      setLoading(false);

      if (result.every((refUpdate) => refUpdate.success)) {
        setBranchCreated(true);
        created = true;
      } else {
        setBranchCreated(false);
        created = false;
        // throw new Error(`Failed to create branch "${newBranch}".`);
      }
    } catch (error) {
      setLoading(false);
      setBranchCreated(false);
      created = false;
      throw error;
    }
    return created;
  };

  return { createBranch, loading, branchCreated };
};

export default useCreateBranch;
