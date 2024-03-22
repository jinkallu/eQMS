import { useState } from 'react';
import { getClient } from 'azure-devops-extension-api';
import { GitRestClient } from 'azure-devops-extension-api/Git';

const useInitializeMainBranch = () => {
  const [loading, setLoading] = useState(false);

  const initializeMainBranch = async (projectId, repositoryId, branchName) => {
    setLoading(true);
    try {
      const gitClient = getClient(GitRestClient);

      const initCommit = {
        refUpdates: [
          {
            name: 'refs/heads/'+branchName,
            oldObjectId: '0000000000000000000000000000000000000000',
          },
        ],
        commits: [
          {
            comment: 'Initial commit',
            changes: [
              {
                changeType: 'add',
                item: {
                  path: '/README.md',
                },
                newContent: {
                  content: '# New QMS Repository\n\nThis is the initial commit.',
                  contentType: 'rawtext',
                },
              },
            ],
          },
        ],
      };

      await gitClient.createPush(initCommit, repositoryId, projectId);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { initializeMainBranch, loading };
};

export default useInitializeMainBranch;
