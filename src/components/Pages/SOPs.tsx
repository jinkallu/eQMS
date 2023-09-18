import React from "react";
import { Grid, Box, Button, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SOPCard from "../SOPCard";

import { useExtnStore } from "../../zustand/store";
import { createSearchParams, useNavigate } from "react-router-dom";

const SOPs = () => {
  const {
    setFileNames,
    branchFileNames,
    userSOPs,
    isQualityMgrSelected,
    repository,
    branchTypes,
    refreshDBData,
    project,
  } = useExtnStore((state) => state);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (project && project?.id && repository && repository.id) {
      refreshDBData(project.id, project.name, repository.id);
    }
  }, [project, repository]);

  React.useEffect(() => {
    if (repository && repository?.id) {
      console.log(branchTypes);
      branchTypes["sop"]?.map((branch) => {
        setFileNames(repository?.id, branch.branchId, branch.name, "sop");
      });

      const type = "temp";
      branchTypes[type]?.map((branch) => {
        setFileNames(repository?.id, branch.branchId, branch.name, type);
      });
    }
  }, [repository, branchTypes]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "12px",
          alignItems: "flex-end",
          gap: "5px",
          paddingBottom: "12px",
        }}
      >
        {isQualityMgrSelected && (
          <Button
            variant="outlined"
            onClick={() => {
              navigate("/qmshub.html/addsop");
            }}
          >
            Create New SOP
          </Button>
        )}
        <TextField
          id="searchInput"
          placeholder="Search SOPs & Templates"
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
      </Box>

      <Grid
        container
        spacing={{ xs: 2, md: 3, lg: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ padding: "9px" }}
      >
        {userSOPs
          ?.sort((sop) => sop?.sortOrder)
          ?.map((sop) => {
            const branch = branchFileNames?.find(
              (item) => item.branchId === sop.branchId && item.type === "sop"
            );

            //
            return (
              <Grid key={sop.branchId} item xs={2} sm={2} md={2} lg={2}>
                <SOPCard branch={branch} sop={sop}></SOPCard>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
};

export default SOPs;
