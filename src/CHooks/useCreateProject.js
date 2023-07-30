import { useState } from 'react';
import { getClient } from "azure-devops-extension-api";
import { CoreRestClient } from "azure-devops-extension-api/Core";

import useProcessIdByName from './useProcessIdByName';
;



const useCreateProject = (processName) => {
    const [loading, setLoading] = useState(false);

    const { processId, loading: processIdLoading } = useProcessIdByName(processName);
    const ready = processId !== null && !processIdLoading;

    



    // Define the sleep function
    const sleep = (duration) => {
        return new Promise((resolve) => setTimeout(resolve, duration));
    };


    const createProject = async (projectName, projectDescription) => {
        setLoading(true);
        
        try {

            let maxTries = 1;
            while (!ready && maxTries > 0) {
                // Wait for 1 seconds
                await sleep(1000);
                maxTries--;
            }

            if (!processId) {
                throw new Error("Process ID not available");
            }
            // Create a Core REST client
            const coreClient = getClient(CoreRestClient);

            // Define the project properties
            const projectToCreate = {
                name: projectName,
                description: projectDescription,
                capabilities: {
                    versioncontrol: {
                        sourceControlType: "Git",
                    },
                    processTemplate: {
                        templateTypeId: processId, // Agile process template
                    },
                },
            };

            // Create the project
            const newP = await coreClient.queueCreateProject(projectToCreate);
            //await sleep(60000); //TODO: change this to a better way , it is a big risk to keep it like this, also check the return values of the functions below
            // Wait for the project creation to complete
            //await waitForProjectCreation(newProject.id);
            const newProject = await waitForProjectCreation(coreClient, projectName);




            setLoading(false);
            return newProject;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    
    async function waitForProjectCreation(coreClient, projectId, timeout = 60000, interval = 5000) {
        const startTime = Date.now();
      
        while (Date.now() - startTime < timeout) {
          try {
            const project = await coreClient.getProject(projectId);
            console.log(project);
            if (project && project.state === 1) {
              return project;
            }
          } catch (error) {
            // Handle error if needed
          }
      
          await new Promise((resolve) => setTimeout(resolve, interval));
        }
      
        throw new Error(`Project creation timeout exceeded (${timeout} ms)`);
      }
      

    return { createProject, loading };
};

export default useCreateProject;
