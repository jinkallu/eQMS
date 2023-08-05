import { Paper, TextField, Box, Typography, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { useGetRepoDetails, useProject } from "../zustand/store";
import useCreateBranch from "../CHooks/useCreateBranch";
import useCommit from "../CHooks/useCommit";
import { v4 as uuidv4 } from "uuid";
import { createSearchParams } from "react-router-dom";
export default function AddSOP() {
  const [name, setName] = React.useState("");
  const [number, setNumber] = React.useState("");
  const [error, setError] = React.useState("");
  const { branchFileNames, repository, setBranches, setFileNames } =
    useGetRepoDetails((state) => state);
  const { renameFile, loadingRenameFile } = useCommit();
  const navigate = useNavigate();
  const { createBranch, loading, branchCreated } = useCreateBranch();
  const project = useProject((state) => state.project);

  async function handleCreate() {
    // check for duplicate name or number
    const data = branchFileNames?.filter(
      (item) =>
        item.type === "sop" &&
        (item.relativePath.split("-")[1] === number ||
          item.relativePath.split("-")[2] === name)
    );
    if (data?.length > 0) {
      setError("Another SOP for the same number or same exists...");
      return;
    }
    // create unique id for the sop branch name
    const uniqueId = uuidv4();
    const branchName = `qms/sop/${uniqueId}/main`;
    const res = await createBranch(
      project.id,
      repository.id,
      "main",
      branchName
    );

    // create path for the sop like sop/management/
    let newPath = name;
    if (number) {
      newPath = number + "-" + newPath;
      newPath = "sop" + "-" + newPath;
    }
    const file_name = newPath + ".md";
    newPath = "qms/" + "sop" + "/" + newPath + "/" + file_name;

    newPath = "/" + newPath;
    newPath = newPath.replace(/ /g, "-");

    // rename the current readme.md so that the folder structure created..

    const renameRes = await renameFile(
      project.id,
      repository.id,
      branchName,
      "/README.md",
      newPath,
      "rename default README.md file"
    );
    if (renameRes) {
      setBranches(repository.id);
    }
    setName("");
    setNumber("");
    // get the object id of the folder for navigation
    const objectId = await setFileNames(repository?.id, branchName, "sop");
    if (objectId) {
      navigate({
        pathname: "/qmshub.html/content",
        search: `?${createSearchParams({
          objectId,
        })}`,
      });
    }
  }

  function handleCancel() {
    setName("");
    setNumber("");
    navigate("/qmshub.html/");
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
        padding: "24px",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          alignSelf: "flex-start",
          paddingBottom: "24px",
          paddingTop: "12px",
        }}
      >
        Enter required details to create an SOP
      </Typography>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "36px",
          flexDirection: "column",
          gap: "12px",
          height: "100%",
        }}
      >
        <TextField
          helperText="Please enter SOP name"
          id="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></TextField>

        <TextField
          helperText="Please enter SOP number"
          id="number"
          label="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        ></TextField>
        <Typography sx={{ fontSize: "12px", color: "red" }}>{error}</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            padding: "0px",
          }}
        >
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={loading || loadingRenameFile}
            variant="contained"
            color="primary"
            onClick={handleCreate}
          >
            Create
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
