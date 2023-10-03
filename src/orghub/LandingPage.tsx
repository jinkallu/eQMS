import Box from "@mui/material/Box";
import DynamicIsland from "../components/DynamicIsland";
import { useExtnStore } from "../zustand/store";
import { Paper, Typography } from "@mui/material";
import React from "react";
import useRWDataStorage from "../CHooks/useRWDataStorage";
import useProjectExists from "../CHooks/useProjectExists";
import useAzureNavigation from "../CHooks/useAzureNavigation";

export default function LandingPage() {
  const setMessage = useExtnStore((state) => state.setMessage);
  const { readData, isLoading, error } = useRWDataStorage();
  const { checkProject, loading: projectExistsLoading } = useProjectExists();
  const { setProject, project } = useExtnStore((state) => state);
  const {
    azureNavigate,
    isLoading: navigationLoading,
    error: navigaitonError,
  } = useAzureNavigation();

  React.useEffect(() => {
    getMainProjectData();
  }, []);

  async function getMainProjectData() {
    try {
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
  function removeApisProjectsFromUrl(url) {
    const regex = /_apis\/projects\//;
    return url.replace(regex, "");
  }

  async function navigateToProject() {
    setMessage({
      showAlert: true,
      message: "Navigating to project..",
    });

    await azureNavigate(
      removeApisProjectsFromUrl(project?.url) + "/_apps/hub/D2Ops.D2Ops.d2ops"
    ); // TODO read it from a settings .json
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
      <DynamicIsland></DynamicIsland>
      {Object.keys(project)?.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            "&:hover": {
              backgroundColor: "#0b204d",
              color: "white",
            },
            padding: "24px",
            cursor: "pointer",
            border: "2px solid #0b204d",
          }}
          onClick={navigateToProject}
        >
          <Typography>{project.name}</Typography>
        </Paper>
      )}
    </Box>
  );
}
