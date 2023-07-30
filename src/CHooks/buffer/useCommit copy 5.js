import { useState } from 'react';
import { getClient } from 'azure-devops-extension-api';
import { GitRestClient } from 'azure-devops-extension-api/Git';

const useCommit = () => {
    const [loading, setLoading] = useState(false);
    const [branchCreated, setBranchCreated] = useState(false);

    const commit = async (projectId, repositoryId, branchName, filePath, newContent, commitMessage) => {
        setLoading(true);
        setBranchCreated(false);
        let created = false;

        try {
            const gitClient = getClient(GitRestClient);
            const [refsResult] = await Promise.all([
                gitClient.getRefs(repositoryId, projectId, 'heads'),
                //gitClient.getItemContent(repositoryId, filePath, branchName),
            ]);
            console.log(refsResult);

            const currentBranch = refsResult.filter((ref) => ref.name === `refs/heads/${branchName}`)[0];
            console.log(`refs/heads/${branchName}`, currentBranch);
            const currentCommitId = currentBranch.objectId;
            //const oldObjectId = fileContentResult.objectId;

            const change = {
                changeType: 1, //1 add, 2 Edit
                item: {
                    path: filePath,
                },
                newContent: {
                    content: btoa(newContent),
                    contentType: 1, // RawText
                },
            };

            const push = {
                commits: [
                    {
                        comment: commitMessage,
                        changes: [change],
                    },
                ],
                refUpdates: [
                    {
                        name: currentBranch.name,
                        oldObjectId: currentCommitId,
                    },
                ],
                repositoryId,
            };

            await gitClient.createPush(push, repositoryId);
            created = true;
        } catch (error) {
            //setLoading(false);
            //setBranchCreated(false);
            created = false;
            throw error;
        }
        return created;
    };

    const renameFile = async (projectId, repositoryId, branchName, filePath, newFilePath, commitMessage) => {
        setLoading(true);
        setBranchCreated(false);
        let created = false;

        try {
            const gitClient = getClient(GitRestClient);
            const [refsResult] = await Promise.all([
                gitClient.getRefs(repositoryId, projectId, 'heads'),
                //gitClient.getItemContent(repositoryId, filePath, branchName),
            ]);
            console.log(refsResult);

            const currentBranch = refsResult.filter((ref) => ref.name === `refs/heads/${branchName}`)[0];
            console.log(`refs/heads/${branchName}`, currentBranch);
            const currentCommitId = currentBranch.objectId;
            //const oldObjectId = fileContentResult.objectId;

            const change = {
                changeType: 8, // Rename
                sourceServerItem: filePath,
                item: {
                    path: newFilePath,
                },
                newContent: null,
            };

            const push = {
                commits: [
                    {
                        comment: commitMessage,
                        changes: [change],
                    },
                ],
                refUpdates: [
                    {
                        name: currentBranch.name,
                        oldObjectId: currentCommitId,
                    },
                ],
                repositoryId,
            };

            await gitClient.createPush(push, repositoryId);
            created = true;
        } catch (error) {
            //setLoading(false);
            //setBranchCreated(false);
            created = false;
            throw error;
        }
        return created;
    };


    return { commit, renameFile };
};

export default useCommit;
