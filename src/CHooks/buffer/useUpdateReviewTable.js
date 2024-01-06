import { useState } from "react";
import { getClient } from "azure-devops-extension-api";
import { GitRestClient } from "azure-devops-extension-api/Git";


const useUpdateReviewTable = () => {
    const [pullRequestId, setPullRequestId] = useState(null);
    const [authorData, setAuthorData] = useState(null);

    const fetchPullRequestId = async (projectId, repositoryId, branchName) => {
        const gitClient = getClient(GitRestClient);
        var id = null;
        try {
            const branch = await gitClient.getBranch(repositoryId, branchName, projectId);
            const latestCommitId = branch.commit.commitId;
            const commit = await gitClient.getCommit(latestCommitId, repositoryId, projectId);
            console.log(commit);
            const extractedPullRequestId = extractPullRequestIdFromCommitMessage(commit.comment);
            setPullRequestId(extractedPullRequestId);
            id = extractedPullRequestId;
        } catch (error) {
            console.error("Error fetching pull request ID:", error);
            id = null;
        }
        return id;
    };

    const extractPullRequestIdFromCommitMessage = (message) => {
        const regex = /PR #?(\d+)/; // TODO: need a better management
        const match = message.match(regex);

        return match ? parseInt(match[1], 10) : null;
    };

    const getLatestCommit = async (repositoryId, branchName, projectId) => {
        try{
            const gitClient = getClient(GitRestClient);
            const branch = await gitClient.getBranch(repositoryId, branchName, projectId);
            const latestCommitId = branch.commit.commitId;
            const commit = await gitClient.getCommit(latestCommitId, repositoryId, projectId);
            return commit;
        }
        catch {
            return null;
        }
    }

    const fetchAuthorData = async (projectId, repositoryId, branchName) => {
        
        const commit = await getLatestCommit(repositoryId, branchName, projectId);
        setAuthorData(commit.author);
        console.log(commit);   
    }

    return { authorData, fetchAuthorData };
};

export default useUpdateReviewTable;
