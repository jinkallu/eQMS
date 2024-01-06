import { useState } from "react";
import { getClient } from "azure-devops-extension-api";
import { GitRestClient } from "azure-devops-extension-api/Git";


const useReviewer = () => {
    const [reviewerData, setReviewerData] = useState(null);

    const getLatestCommit = async (repositoryId, branchName, projectId) => {
        try {
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

    async function getReviewerData(projectId, repositoryId, branchName) {
        console.log(projectId, repositoryId, branchName);
        try {
            // Get a list of pull requests merged into the target branch
            const gitClient = getClient(GitRestClient);
            const pullRequests = await gitClient.getPullRequests(
                repositoryId,
                { targetRefName: `refs/heads/${branchName}`, status: 3 }, // Status 3 indicates "completed" pull requests
                projectId,
            );

            // Display information about the merged pull requests
            if (pullRequests === null) {
                return null;
            }

            if(pullRequests.length <= 0){
                return null;
            }

            if(pullRequests[0].reviewers.length <=0 ){
                return null;
            }

            //let reviewers = await gitClient.getPullRequestReviewers(repositoryId, pullRequests[0].pullRequestId, projectId);
            //console.log(reviewers);
            // TODO: check if the PR commit data matches with main branch commit id
            setReviewerData(pullRequests[0].reviewers[0]);
            console.log("Merged Pull Requests:", pullRequests[0]);
        } catch (error) {
            console.error("Error getting merged pull requests:", error.message);
        }
    }

    return { reviewerData, getReviewerData };
};

export default useReviewer;
