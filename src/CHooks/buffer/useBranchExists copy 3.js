import { useState } from 'react';
import { getClient } from 'azure-devops-extension-api';
import { GitRestClient } from 'azure-devops-extension-api/Git';

const useBranchExists = () => {
  const [loading, setLoading] = useState(false);
  const [branchExists, setBranchExists] = useState(null);


  const branchExistsCheck = async (projectId, repositoryId, branchName) => {
    setLoading(true);
    let exists = false;

    try {
      const gitClient = getClient(GitRestClient);
      const branchRefs = await gitClient.getRefs(repositoryId, projectId, `heads/${branchName}`);

      if (branchRefs.length > 0) {
        console.log("Branch exists ", branchName);
        //setBranchExists(true);
        exists = true;
      } else {
        console.log("Branch does not exists ", branchName);
        //setBranchExists(false);
        exists = false;
      }

    } catch (error) {
      //setBranchExists(false);
      exists = false;
      throw error;
    }
    finally {
        setLoading(false);
    }
    return exists;

  };

  return { branchExistsCheck, branchExists, loading };
};

export default useBranchExists;
