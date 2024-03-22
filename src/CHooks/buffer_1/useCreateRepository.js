import { useState } from 'react';
import { getClient } from "azure-devops-extension-api";
import { GitRestClient } from "azure-devops-extension-api/Git";

const useCreateRepository = () => {
  const [loading, setLoading] = useState(false);

  const createRepository = async (projectId, repositoryName) => {
    setLoading(true);

    try {
      // Create a Git REST client
      const gitClient = getClient(GitRestClient);

      // Define the repository properties
      const repositoryToCreate = {
        name: repositoryName,
      };

      // Create the repository
      const newRepository = await gitClient.createRepository(repositoryToCreate, projectId);

      setLoading(false);
      return newRepository;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { createRepository, loading };
};

export default useCreateRepository;
