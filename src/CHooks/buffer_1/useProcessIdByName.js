import { useState, useEffect } from 'react';
import { getClient } from "azure-devops-extension-api";
import { WorkItemTrackingProcessRestClient } from "azure-devops-extension-api/WorkItemTrackingProcess";

const useProcessIdByName = (processName) => {
    const [processId, setProcessId] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const getProcessIdByName = async () => {
  
        // Create a WorkItemTrackingProcess REST client
        const workItemTrackingProcessClient = getClient(WorkItemTrackingProcessRestClient);

        // Get all processes
        const processes = await workItemTrackingProcessClient.getListOfProcesses();
  
        // Find the process by name
        const process = processes.find((p) => p.name === processName);
  
        // Update the state
        setProcessId(process ? process.typeId : null);
        setLoading(false);
      };
  
      if (processName) {
        getProcessIdByName();
      }
    }, [processName]);
  
    return { processId, loading };
  };
  
  export default useProcessIdByName;