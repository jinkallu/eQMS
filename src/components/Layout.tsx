import React, { useState } from "react";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useExtnStore } from "../zustand/store";
import useRWDataStorage from "../CHooks/useRWDataStorage";
import useProjectExists from "../CHooks/useProjectExists";
import AlertSnackbar from "./AlertSnackbar";
import Header from "./Header";
import CircularProgress from "@mui/material/CircularProgress";

export default function Layout({ children }) {
  const setAlertMessage = useExtnStore((state) => state.setAlertMessage);
  const { readData, isLoading, error } = useRWDataStorage();
  const { checkProject, loading: projectExistsLoading } = useProjectExists();
  const [projectExisting, setProjectExisting] = useState(false);

  const { setCurrentUser, setProject, project, setRepository, repository } =
    useExtnStore((state) => state);

  React.useEffect(() => {
    // this check is required as when navigating directly to project page will cause the project details empty.
    getMainProjectData();
  }, []);
  async function getMainProjectData() {
    try {
      if (project && project?.id) {
        return;
      }
      setAlertMessage({
        showAlert: true,
        message: "Checking existing project",
      });
      const res: any = await readData("project");
      const resParsed = JSON.parse(res);
      const newProject = await checkProject(resParsed.name);
      if (newProject) {
        setProject(newProject);

        setAlertMessage({ showAlert: true, message: "Project found..." });
        setProjectExisting(true);
      } else {
        setAlertMessage({
          showAlert: true,
          message: "No project found. Create new",
        });
      }
    } catch (e) {
      setAlertMessage({
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
    }
  }, [project, repository]);
  return isLoading || projectExistsLoading ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress></CircularProgress>
      <h4>Loading project data...</h4>
    </Box>
  ) : projectExisting ? (
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
      (<AlertSnackbar></AlertSnackbar>
      <Header></Header>
      <Toolbar></Toolbar>
      <Box>{children}</Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h3>No project found..Create one to continue</h3>
    </Box>
  );
}
