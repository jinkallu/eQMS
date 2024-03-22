import { useState } from 'react';
import { getClient } from 'azure-devops-extension-api/Common';
import { GitRestClient } from 'azure-devops-extension-api/Git';

const useCompletePullRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const completePullRequest = async (projectId, repositoryId, pullRequestId, deleteSourceBranch=false) => {
    setLoading(true);
    setError(null);
    let pr = null;

    try {
      const gitClient = getClient(GitRestClient);
      const pullRequest = await gitClient.getPullRequestById(pullRequestId, projectId);
        console.log(pullRequest);
      if (pullRequest.status !== 3) {
        pr = await gitClient.updatePullRequest({
          status: 3,
          lastMergeSourceCommit: pullRequest.lastMergeSourceCommit, // Add this line
          autoCompleteSetBy: {
            id: pullRequest.createdBy.id,
          },
          completionOptions: {
            deleteSourceBranch: deleteSourceBranch,
            mergeCommitMessage: 'Automatically merged and closed PR #' + pullRequestId,
            squashMerge: true,
          },
        }, repositoryId, pullRequestId, projectId);
      }

      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
    return pr;
  };

  return { completePullRequest, loading, error };
};

export default useCompletePullRequest;