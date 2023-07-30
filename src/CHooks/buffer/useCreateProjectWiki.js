import { useState } from 'react';
import { getClient } from 'azure-devops-extension-api';
import { WikiRestClient } from 'azure-devops-extension-api/Wiki';

const useCreateProjectWiki = () => {
  const [loading, setLoading] = useState(false);

  const createProjectWiki = async (projectId, wikiName) => {
    setLoading(true);

    try {
      // Create a Wiki REST client
      const wikiClient = getClient(WikiRestClient);

      // Create the wiki
      const newWiki = {
        name: wikiName,
        projectId: projectId,
        type: 'projectWiki'
      };

      const createdWiki = await wikiClient.createWiki(newWiki);
      setLoading(false);
      return createdWiki;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { createProjectWiki, loading };
};

export default useCreateProjectWiki;
