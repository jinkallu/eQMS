import React, { useEffect, useState } from "react";
import useCreateProject from "../CHooks/useCreateProject"
import useProjectExists from "../CHooks/useProjectExists";
import useCreateBranch from "../CHooks/useCreateBranch";

import useInitializeMainBranch from "../CHooks/buffer/useInitializeMainBranch";
import useGetRepositoryId from "../CHooks/buffer/useGetRepositoryId";
import useRWDataStorage from "../CHooks/useRWDataStorage";
import { Box } from "@mui/system";
import { Alert, Button, Paper, TextField } from "@mui/material";
import DynamicIsland from "./DynamicIsland";
import useQMSDataOps from "../CHooks/buffer/useQMSDataOps";
import useCreateTeam from "../CHooks/useCreateTeam";
import useCommit from "../CHooks/useCommit";
import useAddMemberToTeam from "../CHooks/useAddMemberToTeam";
import * as SDK from "azure-devops-extension-sdk";


const ProjectCreator = ({settingsData}) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const processName = "test_agile"; // TODO: pass 
  const { createProject, loading } = useCreateProject(processName);
  const { loading: projectExistsLoading, projectExists, checkProject } =
    useProjectExists(projectName);
  const [message, setMessage] = useState("");
  const [projectCreated, setProjectCreated] = useState(false);

  const [severity, setSeverity] = useState("info");
  const [showAlert, setShowAlert] = useState(false);
  const { saveData, readData, data, isLoading, error } = useRWDataStorage();


  const { initializeMainBranch, loading: initMainLoading } = useInitializeMainBranch();

  const { getRepositoryId, loadingRepoId } = useGetRepositoryId();

  const { qmsData, qmsRepoId, initStoreQMS, initQMSProjectId, addNode, setKey } = useQMSDataOps(settingsData);

  const {createTeam, teamCreated} = useCreateTeam();
  const { createBranch, loadingCreateBranch } = useCreateBranch();
  const {commit} = useCommit();
  const { addMemberToTeam } = useAddMemberToTeam();

  async function createProjectFun() {
    const newProject = await createProject(projectName, projectDescription);
    return newProject;
  }

  /*const checkIfProjectData = () => {
    let counter = 0;
    const intervalId = setInterval(() => {
      counter++;
      if (newProjectData) {
        console.log("Variable is true!");
        clearInterval(intervalId);
      } else if (counter >= 60) {
        console.log("Timeout exceeded!");
        clearInterval(intervalId);
      } else {
        console.log("Variable is still false...");
      }
    }, 1000);
  };*/

  useEffect(() => {
    if (loading) {
      setMessage(`creating Project with name ${projectName}`);
      setSeverity("info");
      setShowAlert(true);
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    setShowAlert(true);

    try {
      const newProject = await createProjectFun();
      if (newProject) {
        console.log("befor esetting setNewProjectData ", newProject);
        //setNewProjectData(newProject);
        setMessage(`Project ${newProject} created.`);
        setShowAlert(true);


        const mainBranch = await initializeMainBranch(
          projectName,
          projectName,
          "main"
        );
        const repoId = await getRepositoryId(projectName, projectName);


        //const createdWiki = await createProjectWiki(newProject.id, "QMS");
        await createBranch(projectName, projectName, "main", "qms/database/main");
        await commit(
          newProject.id,
          repoId,
          "qms/database/main",
          "sops.json",
          "",
          "first",
          1
        )
        /*await createBranch(
          projectName,
          projectName,
          "qms/qm/main",
          "qms/qm/edit"
        );
        const repoId = await getRepositoryId(projectName, projectName);
        const newWiki = await publishCodeAsWiki(
          newProject.id,
          repoId,
          "qms/qm/edit",
          "qms_qm_edit"
        );*/
        console.log(" ##");

        

        console.log("before initQMSProjectId ", newProject);
        await initQMSProjectId(newProject.id, newProject.name);

          const createdTeam = await createTeam({
            description: "QMS",
            name: "Quality Manager Team",
          }, newProject.id);

          const user = await SDK.getUser();

          await addMemberToTeam(createdTeam.identity.subjectDescriptor, user.descriptor);
        
          await saveData("project", JSON.stringify(newProject));

        setProjectCreated(true);
      }
      else {
        console.log("Error: Unable to create new project");
      }
      //await readQMS();

    } catch (error) {
      setMessage("Some error occured");
      setShowAlert(true);
      console.error("Error creating project:", error);
      setProjectCreated(false);
    }
  };


  const isCreateButtonDisabled = () => {
    return (
      loading || projectExistsLoading || projectExists || projectName === ""
    );
  };

  useEffect(() => {
    async function createQMS() {
      await initStoreQMS("QMS", "root", "qms");
    }

    if (qmsRepoId) {
      createQMS();
    }
  }, [qmsRepoId]);



  useEffect(() => {
    if (!projectName) {
      return;
    }
    console.log("proj name ", projectName);
    if (projectExistsLoading) {
      setMessage("Checking project name availability..");
      setSeverity("info");
    }

    if (projectExists) {
      setMessage(`Project with name ${projectName} already exists ..`);
      setSeverity("error");
    } else {
      setMessage(`Project  name ${projectName} is available ..`);
      setSeverity("info");
    }

    if (loading) {
      setMessage(`Creating project ..`);
      setSeverity("info");
    }
  }, [projectName, projectExists, projectExistsLoading]);

  async function readProjectFromDb() {
    const res = await readData("project");
    if (res) console.log(JSON.parse(res));
    console.log(error);
    console.log(data);
  }

  useEffect(() => {
    //readProjectFromDb();
    checkProject(projectName);
  }, [projectName]);

  function handleProjectNameChange(e) {
    setProjectName(e.target.value);
    setShowAlert(true);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "20px",
        minHeight: "50vh",
      }}
    >
      <DynamicIsland
        open={showAlert}
        defaultMessage="Create Project"
        message={message}
        severity={severity}
      ></DynamicIsland>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <TextField
          sx={{ marginBottom: "10px" }}
          required
          value={projectName}
          onChange={handleProjectNameChange}
          id="projectName"
          label="Project Name"
          variant="outlined"
        />

        <TextField
          sx={{ marginBottom: "10px" }}
          required
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          id="projectDescription"
          label="Project Description"
          variant="outlined"
        />

        <Button
          disabled={isCreateButtonDisabled()}
          variant="contained"
          onClick={handleSubmit}
        >
          {loading ? "Creating Project..." : "Create Project"}
        </Button>
      </Paper>
    </Box>
  );

};

export default ProjectCreator;
