import { useState } from "react";
import { getClient } from "azure-devops-extension-api";
import { GitRestClient } from "azure-devops-extension-api/Git";


const useReviewer = () => {
    const [reviewerData, setReviewerData] = useState(null);
    const [versionData, setVersionData] = useState(null);
    const [versionHistory, setVersionHistory] = useState(null);

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

    async function getPRs(projectId, repositoryId, branchName){
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

            return pullRequests;

            // if(pullRequests[0].reviewers.length <=0 ){
            //     return null;
            // }

            //let reviewers = await gitClient.getPullRequestReviewers(repositoryId, pullRequests[0].pullRequestId, projectId);
            //console.log(reviewers);
            // TODO: check if the PR commit data matches with main branch commit id
            //setReviewerData(pullRequests[0].reviewers[0]);
            //console.log("Merged Pull Requests:", pullRequests[0]);
        } catch (error) {
            console.error("Error getting merged pull requests:", error.message);
        }
    }

    async function getReviewerData(projectId, repositoryId, branchName) {
        console.log(projectId, repositoryId, branchName);
        try {
            const pullRequests = await getPRs(projectId, repositoryId, branchName);

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

    async function getVersionData(projectId, repositoryId, branchName){
        try {
            const pullRequests = await getPRs(projectId, repositoryId, branchName);
            setVersionData(pullRequests.length);
            console.log("PR", pullRequests)
        }
        catch{
            setVersionData(null);
        } 
    }

    async function getVersionHistory(projectId, repositoryId, branchName){
        let searchCriteria = {
            itemVersion: {
                version: branchName, // replace 'branchName' with the name of your branch
                versionType: 'branch'
            }
        };
        
        // Get the commits
        const gitClient = getClient(GitRestClient);

        let commits = await gitClient.getCommits(repositoryId, searchCriteria, projectId);
        // TODO: Verify that the version commit id matches to that of PRs lastMergeCommit  
        setVersionHistory(commits);
        console.log(commits);
    }

    return { reviewerData, getReviewerData, versionData, getVersionData, versionHistory, getVersionHistory };
};

export default useReviewer;
