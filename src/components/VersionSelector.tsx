import Grid from "@mui/material/Grid";
import React, { useEffect, version } from "react";
import { useExtnStore } from "../zustand/store";
import useVersion from "../CHooks/buffer/useVersion";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { useSearchParams } from "react-router-dom";
import { FormControlLabel, Switch } from "@mui/material";

export default function VersionSelector({
  setViewEditBranch,
  viewEditBranch,
  setVersion,
}) {
  const [versionIndex, setVersionIndex] = React.useState("");
  const { repository, project } = useExtnStore((state) => state);
  const [searchParams] = useSearchParams();
  const {
    versionData,
    getVersionData,
    currentEditBranch,
    getCurrentEditBranch,
  } = useVersion();

  useEffect(() => {
    if (!project?.id || !repository?.id || !searchParams) {
      return;
    }
    const branchName = searchParams.get("branchName");
    let lastIndex = branchName.lastIndexOf("/main");

    //Replace the last occurrence with "/edit"
    let editBranchName =
      branchName.substring(0, lastIndex) +
      "/edit" +
      branchName.substring(lastIndex + "/main".length);

    getVersionData(project.id, repository.id, branchName);
    getCurrentEditBranch(repository.id, editBranchName, project.id);
  }, [project, repository, searchParams]);

  const handleVersionChange = (event: SelectChangeEvent) => {
    const index_string = event.target.value as string;
    if (index_string.length === 0) {
      return;
    }
    setVersionIndex(index_string);

    const index = parseInt(index_string);

    setVersion(versionData?.history[index]);

    if (versionData?.history) {
      if (versionData?.history?.length <= 0) {
        return;
      }
    } else {
      return;
    }
  };

  function handleChange(e) {
    setViewEditBranch(e.target.checked);
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      {currentEditBranch && (
        <FormControlLabel
          control={
            <Switch
              checked={viewEditBranch}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label="Edit Version"
        />
      )}

      {!viewEditBranch && (
        <FormControl style={{ width: "200px" }}>
          <InputLabel id="demo-simple-select-label">
            Previous Versions:
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={versionIndex}
            label="Previous "
            onChange={handleVersionChange}
          >
            {versionData &&
              versionData.history &&
              versionData?.history?.map((version, index) => (
                <MenuItem key={index} value={index}>
                  {`${versionData?.history?.length - index}-${
                    versionData?.history[index]?.committer?.date
                  }`}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
