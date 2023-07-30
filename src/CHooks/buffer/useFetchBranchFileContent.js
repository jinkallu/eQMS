import { useState } from 'react';
import { getClient } from 'azure-devops-extension-api/Common';
import { GitRestClient } from 'azure-devops-extension-api/Git';

const useFetchBranchFileContent = () => {
  const [fileContent, setFileContent] = useState('');

  const fetchBranchFileContent = async (projectId, repositoryId, filePath, branch) => {
    let content = null;
    console.log(`refs/heads/${branch}`);
    const versionDescriptor = {
      version: branch,
      versionType: 0,
    };
    try {
      
      // TODO wrong call, correct it
      const gitClient = getClient(GitRestClient);
      
      content = await gitClient.getItemText(
        repositoryId,
        filePath,
        projectId,
        undefined, // scopepath
        undefined, // recursionLevel
        undefined, // includeContentMetadata,
        true, // latestProcessedChange
        false, // download
        versionDescriptor
        //{ versionDescriptor: { version: `refs/heads/${branch}`, versionType: 0 } }
      );

      //content = await fileResponse.text();
      setFileContent(content);
    } catch (error) {
      console.error('Error fetching file content:', error);
    }

    return content;
  };

  return { fileContent, fetchBranchFileContent };
}

export default useFetchBranchFileContent;
