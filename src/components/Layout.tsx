import React from "react";

import { Box } from "@mui/material";
import DynamicIsland from "./DynamicIsland";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { useDynamicIsland, useProject } from "../zustand/store";
import useRWDataStorage from "../CHooks/useRWDataStorage";
import useProjectExists from "../CHooks/useProjectExists";
import AlertSnackbar from "./AlertSnackbar";

export default function Layout() {
  const setMessage = useDynamicIsland((state) => state.setMessage);
  const { readData, isLoading, error } = useRWDataStorage();
  const { checkProject, loading: projectExistsLoading } = useProjectExists();
  const { setProject, project } = useProject((state) => state);
  const setDefaultMessage = useDynamicIsland(
    (state) => state.setDefaultMessage
  );

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
    setDefaultMessage("QMS");
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "95vh",
      }}
    >
      <AlertSnackbar></AlertSnackbar>
      <Sidebar></Sidebar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DynamicIsland></DynamicIsland>
        </Box>

        <Outlet></Outlet>
      </Box>
    </Box>
  );
}
