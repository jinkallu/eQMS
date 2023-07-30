import { useState } from 'react';
import { getClient } from 'azure-devops-extension-api';
import { WikiRestClient, WikiCreateParametersV2  } from 'azure-devops-extension-api/Wiki';

const usePublishCodeAsWiki = () => {
  const [loading, setLoading] = useState(false);

  const publishCodeAsWiki = async (projectId, repositoryId, branch, wikiName, mappedPath = "/") => {
    setLoading(true);
    let published = false;

    try {
      // Create a Wiki REST client
      const wikiClient = getClient(WikiRestClient);

      // Create the wiki
      const newWiki:WikiCreateParametersV2  = {
        name: wikiName,
        projectId: projectId,
        repositoryId: repositoryId,
        mappedPath: mappedPath,
        type: 1, //"codeWiki",
        version: {
          "version": branch,
          "versionOptions": 0,
          "versionType": 0 
        },
      };

      const createdWiki = await wikiClient.createWiki(newWiki, projectId);
      setLoading(false);
      published = true; //TODO: check return value for success
    } catch (error) {
      setLoading(false);
      throw error;
      published = false;
    }

    return published;
  };

  return { publishCodeAsWiki, loading };
};

export default usePublishCodeAsWiki;
