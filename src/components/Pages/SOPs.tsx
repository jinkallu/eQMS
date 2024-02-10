import React from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SOPCard from "../SOPCard";
import SOPTableView from "../../components/SOPTableView";

import { useExtnStore } from "../../zustand/store";
import { createSearchParams, useNavigate } from "react-router-dom";
import TableViewIcon from "@mui/icons-material/TableView";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AddSOP from "../AddSOP";

import useFeatureManage from "../../CHooks/buffer/useFeatureManage";


const SOPs = () => {
  const {
    branchFileNames,
    userSOPs,
    isQualityMgrSelected,
    repository,
    branchTypes,
    refreshSOPDBData,
    project,
    branches,
  } = useExtnStore((state) => state);

  const { disableFeatures } = useFeatureManage();
  disableFeatures(project?.id);

  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [openAddSopModal, setOpenAddSopModal] = React.useState(false);
  const [viewType, setViewType] = React.useState("table");

  async function refreshData(projectId, projectName, repositoryId) {
    setLoading(true);
    try {
      await refreshSOPDBData(projectId, projectName, repositoryId);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (project && project?.id && repository && repository.id) {
      refreshData(project.id, project.name, repository.id);
      //   getPullRequests();
    }
  }, [project, repository]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AddSOP open={openAddSopModal} setOpen={setOpenAddSopModal}></AddSOP>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "12px",
          alignItems: "flex-end",
          gap: "5px",
          paddingBottom: "12px",
          marginY: "24px",
        }}
      >
        {isQualityMgrSelected && (
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            onClick={() => {
              setOpenAddSopModal(true);
            }}
          >
            Create SOP
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: "32px",
          }}
        >
          {viewType === "table" && (
            <Tooltip title="Card view">
              <CreditCardIcon
                onClick={() => setViewType("card")}
              ></CreditCardIcon>
            </Tooltip>
          )}
          {viewType === "card" && (
            <Tooltip title="Table view">
              <TableViewIcon
                onClick={() => setViewType("table")}
              ></TableViewIcon>
            </Tooltip>
          )}
        </Box>
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
          {viewType === "table" && (
            <SOPTableView userSOPs={userSOPs}></SOPTableView>
          )}
          {viewType === "card" &&
            userSOPs
              ?.sort((sop) => sop?.sortOrder)
              ?.map((sop) => {
                const edit = branches.find(
                  (item) =>
                    item.name ===
                    `qms/sop/${sop.branchId}/${sop.relativePath}/edit`
                );
                //
                return (
                  <Grid key={sop.branchId} item xs={2} sm={2} md={2} lg={2}>
                    <SOPCard edit={edit} sop={sop}></SOPCard>
                  </Grid>
                );
              })}
        </Grid>
      ) : (
        <Typography>No SOPs to display</Typography>
      )}
    </Box>
  );
};

export default SOPs;
