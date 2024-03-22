import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import SOPTableView from "../../components/SOPTableView";
import { useExtnStore } from "../../zustand/store";
import AddSOP from "../AddSOP";

const SOPs = () => {
  const {
    userSOPs,
    isQualityMgrSelected,
    repository,
    refreshSOPDBData,
    project,
    setAlertMessage,
  } = useExtnStore((state) => state);

  const [loading, setLoading] = useState(false);
  const [openAddSopModal, setOpenAddSopModal] = useState(false);

  async function refreshData(projectId, projectName, repositoryId) {
    setLoading(true);
    try {
      await refreshSOPDBData(projectId, projectName, repositoryId);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setAlertMessage({
        showAlert: true,
        message: "Some error occured while loading SOPs",
      });
    }
  }

  useEffect(() => {
    if (project && project?.id && repository && repository.id) {
      setAlertMessage({
        showAlert: true,
        message: "Loading SOPs",
      });
      refreshData(project.id, project.name, repository.id);
    }
  }, [project, repository]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AddSOP open={openAddSopModal} setOpen={setOpenAddSopModal}></AddSOP>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "5px",
          marginBottom: "24px",
        }}
      >
        {isQualityMgrSelected && (
          <Button
            sx={{ marginLeft: "32px" }}
            variant="contained"
            size="small"
            endIcon={<AddIcon />}
            onClick={() => {
              setOpenAddSopModal(true);
            }}
          >
            Create SOP
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }}></Box>
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress></CircularProgress>
        </Box>
      ) : userSOPs?.length > 0 ? (
        <Grid
          container
          spacing={{ xs: 2, md: 3, lg: 3 }}
          columns={{ xs: 4, sm: 6, md: 10, lg: 10 }}
          sx={{ padding: "9px" }}
        >
          <SOPTableView userSOPs={userSOPs}></SOPTableView>
        </Grid>
      ) : (
        <Typography>No SOPs to display</Typography>
      )}
    </Box>
  );
};

export default SOPs;
