import { useState } from 'react';
import { getClient } from 'azure-devops-extension-api';
import { CoreRestClient } from 'azure-devops-extension-api/Core/CoreClient';

const useCreateTeam = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teamCreated, setTeamCreated] = useState(false);

  const createTeam = async (team, projectId) => {
    setIsLoading(true);
    setError(null);
    setTeamCreated(false);

    try {
      const coreClient = await getClient(CoreRestClient);
      const createdTeam = await coreClient.createTeam(team, projectId);

      if (!createdTeam) {
        throw new Error('Failed to create team.');
      }

      setTeamCreated(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { createTeam, isLoading, error, teamCreated };
};

export default useCreateTeam;
