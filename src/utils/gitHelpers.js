import { getClient } from "azure-devops-extension-api";
import { GitRestClient } from "azure-devops-extension-api/Git";

export const createBranch = async ({
  projectId,
  repositoryId,
  baseBranch,
  newBranch,
}) => {
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

    if (result.every((refUpdate) => refUpdate.success)) {
      created = true;
    } else {
      created = false;
      throw new Error(`Failed to create branch "${newBranch}".`);
    }
    return created;
  } catch (error) {
    console.log(error);
    created = false;
    return created;
  }
};

export const getFileContent = async (repositoryId, path, branchName) => {
  const versionDescriptor = {
    version: branchName,
    versionType: 0,
  };
  try {
    const gitClient = getClient(GitRestClient);

    const content = await gitClient.getItemText(
      repositoryId,
      path,
      null,
      undefined, // scopepath
      undefined, // recursionLevel
      undefined, // includeContentMetadata,
      true, // latestProcessedChange
      false, // download
      versionDescriptor
    );

    return content;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const commit = async ({
  projectId,
  repositoryId,
  branchName,
  filePath,
  newContent,
  commitMessage,
}) => {
  let created = false;

  try {
    const gitClient = getClient(GitRestClient);
    const [refsResult] = await Promise.all([
      gitClient.getRefs(repositoryId, projectId, "heads"),
    ]);

    const currentBranch = refsResult.filter(
      (ref) => ref.name === `refs/heads/${branchName}`
    )[0];
    const currentCommitId = currentBranch.objectId;

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

    await gitClient.createPush(push, repositoryId);
    created = true;
    return { created };
  } catch (error) {
    created = false;
    return { created, error };
  }
};

export const renameFile = async (
  projectId,
  repositoryId,
  branchName,
  filePath,
  newFilePath,
  commitMessage
) => {
  let created = false;

  try {
    const gitClient = getClient(GitRestClient);
    const [refsResult] = await Promise.all([
      gitClient.getRefs(repositoryId, projectId, "heads"),
    ]);

    const currentBranch = refsResult.filter(
      (ref) => ref.name === `refs/heads/${branchName}`
    )[0];
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
    return { created };
  } catch (error) {
    created = false;
    return { created, error };
  }
};

export const createPR = async (
  projectId,
  repositoryId,
  sourceBranch,
  targetBranch,
  title,
  description,
  reviewers
) => {
  try {
    const gitClient = getClient(GitRestClient);
    const pullRequestDetails = {
      sourceRefName: `refs/heads/${sourceBranch}`,
      targetRefName: `refs/heads/${targetBranch}`,
      title: title,
      description: description,
      reviewers: reviewers,
    };
    const newPullRequest = await gitClient.createPullRequest(
      pullRequestDetails,
      repositoryId,
      projectId
    );

    return newPullRequest;
  } catch (error) {
    return false;
  }
};

export const getProjectPullRequests = async (
  projectId,

  searchCriteria
) => {
  try {
    const gitClient = getClient(GitRestClient);

    const pullRequests = await gitClient.getPullRequestsByProject(
      projectId,
      searchCriteria
    );

    return pullRequests;
  } catch (error) {
    return false;
  }
};
