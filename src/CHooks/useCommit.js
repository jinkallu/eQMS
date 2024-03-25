import { useState } from "react";
import { getClient } from "azure-devops-extension-api";
import { GitRestClient } from "azure-devops-extension-api/Git";

const useCommit = () => {
  const [loading, setLoading] = useState(false);
  const [loadingRenameFile, setLoadingRenameFile] = useState(false);
  const [branchCreated, setBranchCreated] = useState(false);

  const commit = async (
    projectId,
    repositoryId,
    branchName,
    filePath,
    newContent,
    commitMessage
  ) => {
    setLoading(true);
    setBranchCreated(false);
    let created = false;

    try {
      const gitClient = getClient(GitRestClient);
      const [refsResult] = await Promise.all([
        gitClient.getRefs(repositoryId, projectId, "heads"),
        //gitClient.getItemContent(repositoryId, filePath, branchName),
      ]);

      const currentBranch = refsResult.filter(
        (ref) => ref.name === `refs/heads/${branchName}`
      )[0];
      const currentCommitId = currentBranch.objectId;
      //const oldObjectId = fileContentResult.objectId;

      const change = {
        changeType: 2, //1 add, 2 Edit
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

      const res = await gitClient.createPush(push, repositoryId);
      created = true;
      return created;
    } catch (error) {
      //setLoading(false);
      //setBranchCreated(false);
      created = false;
      return created;
    }
  };

  const addBinaryFile = async (
    projectId,
    repositoryId,
    branchName,
    filePath,
    newContent,
    commitMessage
  ) => {
    setLoading(true);
    setBranchCreated(false);
    let created = false;

    try {
      const gitClient = getClient(GitRestClient);
      const [refsResult] = await Promise.all([
        gitClient.getRefs(repositoryId, projectId, "heads"),
        //gitClient.getItemContent(repositoryId, filePath, branchName),
      ]);

      const currentBranch = refsResult.filter(
        (ref) => ref.name === `refs/heads/${branchName}`
      )[0];
      const currentCommitId = currentBranch.objectId;
      //const oldObjectId = fileContentResult.objectId;

      const change = {
        changeType: 1, //1 add, 2 Edit
        item: {
          path: filePath,
        },
        newContent: {
          content: newContent,
          contentType: "base64encoded",
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
      return created;
    } catch (error) {
      console.log(error);
      //setLoading(false);
      //setBranchCreated(false);
      created = false;
      return created;
    }
  };

  const renameFile = async (
    projectId,
    repositoryId,
    branchName,
    filePath,
    newFilePath,
    commitMessage
  ) => {
    setLoadingRenameFile(true);
    setBranchCreated(false);
    let created = false;

    try {
      const gitClient = getClient(GitRestClient);
      const [refsResult] = await Promise.all([
        gitClient.getRefs(repositoryId, projectId, "heads"),
        //gitClient.getItemContent(repositoryId, filePath, branchName),
      ]);

      const currentBranch = refsResult.filter(
        (ref) => ref.name === `refs/heads/${branchName}`
      )[0];

      console.log(currentBranch);
      const currentCommitId = currentBranch.objectId;

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
      setLoadingRenameFile(false);
    } catch (error) {
      //setLoading(false);
      //setBranchCreated(false);
      setLoadingRenameFile(false);

      created = false;
      throw error;
    }
    return created;
  };

  return { commit, renameFile, loadingRenameFile, addBinaryFile };
};

export default useCommit;
