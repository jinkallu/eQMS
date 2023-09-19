import {
  Paper,
  TextField,
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Chip,
  Modal,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { useExtnStore } from "../zustand/store";
import useCreateBranch from "../CHooks/useCreateBranch";
import useCommit from "../CHooks/useCommit";
import { v4 as uuidv4 } from "uuid";
import { createSearchParams, useSearchParams } from "react-router-dom";
export default function TemplateCRUD({ open, setOpen, branchId, sopName }) {
  const [name, setName] = React.useState("");
  const [number, setNumber] = React.useState("");
  const [error, setError] = React.useState("");
  const [searchParams] = useSearchParams();

  const {
    branchFileNames,
    repository,
    setBranches,
    setFileNames,
    userSOPs,
    sops,
    saveSOPToDatabase,
    refreshDBData,
    setAlertMessage,
  } = useExtnStore((state) => state);
  const { renameFile, loadingRenameFile } = useCommit();
  const navigate = useNavigate();
  const { createBranch, loading, branchCreated } = useCreateBranch();
  const project = useExtnStore((state) => state.project);
  // const branchId = searchParams.get("branchId");
  // const sopName = searchParams.get("name");

  async function handleCreate() {
    // check for duplicate name or number
    const data = branchFileNames?.filter(
      (item) =>
        item.type === "template" &&
        (item.relativePath.split("-")[1] === number ||
          item.relativePath.split("-")[2] === name)
    );
    if (data?.length > 0) {
      setError("Another SOP for the same number or same exists...");
      return;
    }
    // create unique id for the sop branch name
    const uniqueId = uuidv4();
    const branchName = `qms/temp/${uniqueId}/main`;
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
      newPath = "temp" + "-" + newPath;
    }
    const file_name = newPath + ".md";
    newPath = "qms/" + "temp" + "/" + newPath + "/" + file_name;

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

    const currSop = sops?.find((sop) => sop.branchId === branchId);
    if (currSop) {
      let temp = [];
      if (currSop?.templates) {
        temp = [...currSop.templates, uniqueId];
      } else {
        temp = [uniqueId];
      }

      const newSop = { ...currSop, templates: temp };
      const oldSops = sops?.filter((sop) => sop.branchId !== branchId) || [];

      oldSops.push(newSop);

      const result = await saveSOPToDatabase({
        collectionName: "sops",
        projectId: project.id,
        repositoryId: repository.id,
        newContent: JSON.stringify(oldSops),
        commitMessage: `template added for ${branchId} `,
      });
      if (result) {
        setAlertMessage({
          message: "Template Created...",
          severity: "success",
        });
      } else {
        setAlertMessage({
          message: "Template Creation not successfull...",
          severity: "error",
        });
      }
    }

    // get the object id of the folder for navigation
    const objectId = await setFileNames(repository?.id, branchName, "temp");

    // if (objectId) {
    //   navigate({
    //     pathname: "/qmshub.html/content",
    //     search: `?${createSearchParams({
    //       objectId,
    //     })}`,
    //   });
    // }
    handleCancel();
    refreshDBData(project.id, project.name, repository.id);
    // navigate({
    //   pathname: "/qmshub.html/content/",
    //   search: `?${createSearchParams({
    //     objectId: objectId,
    //     relativePath: newPath,
    //     type: "temp",
    //     branchName: branchName,
    //   })}`,
    // });
  }

  function handleCancel() {
    setName("");
    setNumber("");
    setOpen(false);
    // navigate("/qmshub.html/");
  }
  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "24px",
        }}
      >
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
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Chip label={sopName} color="primary"></Chip>
          </Box>
          <Typography
            variant="h6"
            sx={{
              alignSelf: "flex-start",
              paddingBottom: "24px",
              paddingTop: "12px",
            }}
          >
            Create the Template
          </Typography>
          <TextField
            helperText="Please enter template name"
            id="name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></TextField>

          <TextField
            helperText="Please enter template number"
            id="number"
            label="Number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          ></TextField>
          <Typography sx={{ fontSize: "12px", color: "red" }}>
            {error}
          </Typography>
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
    </Modal>
  );
}
