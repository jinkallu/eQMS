import { useState, useEffect } from "react";
import { getClient } from "azure-devops-extension-api";
import { CoreRestClient } from "azure-devops-extension-api/Core";

const useProjectExists = (projectName) => {
  const [loading, setLoading] = useState(true);
  const [projectExists, setProjectExists] = useState(false);

  const checkProject = async (projectName) => {
    setLoading(true);
    const coreClient = getClient(CoreRestClient);
    const projects = await coreClient.getProjects();
    const foundProject = projects.find(
      (project) => project.name === projectName
    );
    setLoading(false);
    setProjectExists(foundProject);
    return foundProject;
  };

  return { loading, projectExists, checkProject };
};

export default useProjectExists;
