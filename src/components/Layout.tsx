import React from "react";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router";
import { useExtnStore } from "../zustand/store";
import useRWDataStorage from "../CHooks/useRWDataStorage";
import useProjectExists from "../CHooks/useProjectExists";
import AlertSnackbar from "./AlertSnackbar";
import Header from "./Header";

export default function Layout() {
  const setMessage = useExtnStore((state) => state.setMessage);
  const { readData, isLoading, error } = useRWDataStorage();
  const { checkProject, loading: projectExistsLoading } = useProjectExists();

  const {
    setCurrentUser,
    setDefaultMessage,
    setProject,
    project,
    setRepository,
    refreshSOPDBData,
    repository,
  } = useExtnStore((state) => state);

  React.useEffect(() => {
    // this check is required as when navigating directly to project page will cause the project details empty.
    getMainProjectData();
  }, []);
  async function getMainProjectData() {
    try {
      if (project && project?.id) {
        return;
      }
      setMessage({ showAlert: true, message: "Checking existing project" });
      const res: any = await readData("project");
      const resParsed = JSON.parse(res);
      const newProject = await checkProject(resParsed.name);
      if (newProject) {
        setProject(newProject);

        setMessage({ showAlert: true, message: "Project found..." });
      } else {
        setMessage({
          showAlert: true,
          message: "No project found. Create new",
        });
      }
    } catch (e) {
      setMessage({
        showAlert: true,
        message: "Some error occured..",
      });
    }
  }

  React.useEffect(() => {
    if (project && project?.id) {
      setRepository(project?.id, project?.name);
    }
  }, [project]);

  React.useEffect(() => {
    if (project && project?.id && repository && repository.id) {
      setCurrentUser();
      // refreshSOPDBData(project.id, project.name, repository.id);
    }
  }, [project, repository]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: 0,
        margin: 0,
        backgroundColor: "#F5F5F5",
        height: "100vh",
      }}
    >
      <AlertSnackbar></AlertSnackbar>
      <Header></Header>
      <Toolbar></Toolbar>
      <Box sx={{ flexGrow: 1 }}>
        <Outlet></Outlet>
      </Box>
    </Box>
  );
}
