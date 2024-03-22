import { useState } from 'react';
import { getClient } from 'azure-devops-extension-api';
import { GitRestClient } from 'azure-devops-extension-api/Git';

const useCreatePR = () => {
    const [pullRequest, setPullRequest] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


  const createPR = async (projectId, repositoryId, sourceBranch, targetBranch, title, description) => {
    setLoading(true);
    let created = false;

    try {
      const gitClient = getClient(GitRestClient);
      const pullRequestDetails = {
        sourceRefName: `refs/heads/${sourceBranch}`,
        targetRefName: `refs/heads/${targetBranch}`,
        title: title,
        description: description
      };
      const newPullRequest = await gitClient.createPullRequest(pullRequestDetails, repositoryId, projectId);
      setPullRequest(newPullRequest);

      created = newPullRequest;

    } catch (error) {
      //setBranchExists(false);
      created = false;
      throw error;
    }
    finally {
        setLoading(false);
    }
    return created;

  };

  return { createPR, pullRequest, loading };
};

export default useCreatePR;
