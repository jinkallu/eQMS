import { GraphRestClient } from 'azure-devops-extension-api/Graph/GraphClient'
import { getClient } from 'azure-devops-extension-api';
import { useState } from 'react';

function useAddMemberToTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addMemberToTeam = async (teamId, memberId) => {
    try {
      setLoading(true);
      const graphClient = await getClient(GraphRestClient);
      await graphClient.addMembership(memberId, teamId);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  };

  return { addMemberToTeam, loading, error };
}

export default useAddMemberToTeam;
