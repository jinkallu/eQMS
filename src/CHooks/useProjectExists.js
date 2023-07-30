import { useState, useEffect } from "react";
import { getClient } from "azure-devops-extension-api";
import { CoreRestClient } from "azure-devops-extension-api/Core";

const useProjectExists = (projectName) => {
  const [loading, setLoading] = useState(true);

  const checkProject = async (projectName) => {
    setLoading(true);
    const coreClient = getClient(CoreRestClient);
    const projects = await coreClient.getProjects();
    const foundProject = projects.find(
      (project) => project.name === projectName
    );
    setLoading(false);
    return foundProject;
  };

  return { loading, checkProject };
};

export default useProjectExists;
