import {
  Paper,
  TextField,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  Modal,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { useExtnStore } from "../zustand/store";
import useCreateBranch from "../CHooks/useCreateBranch";
import useCommit from "../CHooks/useCommit";
import { v4 as uuidv4 } from "uuid";
import { createSearchParams } from "react-router-dom";
export default function ProdCRUD({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const [name, setName] = React.useState("");
  const [number, setNumber] = React.useState("");
  const [error, setError] = React.useState("");
  const [approvers, setApprovers] = React.useState([]);
  const [authors, setAuthors] = React.useState([]);
  const [readers, setReaders] = React.useState([]);
  const [linkedSops, setLinkedSops] = React.useState([]);

  const {
    branchFileNames,
    repository,
    setBranches,
    setFileNames,
    teamsWithMembers,
    saveToDatabase,
    sops,
    branchTypes,
    products,
    refreshProductDBData,
    setAlertMessage,
  } = useExtnStore((state) => state);

  const { renameFile, loadingRenameFile } = useCommit();
  const navigate = useNavigate();
  const { createBranch, loading, branchCreated } = useCreateBranch();
  const project = useExtnStore((state) => state.project);
  const handleApproverChange = (event) => {
    const {
      target: { value },
    } = event;
    setApprovers(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleAutherChange = (event) => {
    const {
      target: { value },
    } = event;
    setAuthors(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleReaderChange = (event) => {
    const {
      target: { value },
    } = event;
    setReaders(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleLinkedSopsChange = (event) => {
    const {
      target: { value },
    } = event;
    setLinkedSops(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  async function handleCreate() {
    // check for duplicate name or number
    const data = branchFileNames?.filter(
      (item) =>
        item.type === "prod" &&
        (item.relativePath.split("-")[1] === number ||
          item.relativePath.split("-")[2] === name)
    );
    if (data?.length > 0) {
      setError("Another Product for the same number or same exists...");
      return;
    }
    // create unique id for the sop branch name
    const uniqueId = uuidv4();
    const branchName = `qms/prod/${uniqueId}/main`;
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
      newPath = "prod" + "-" + newPath;
    }
    const file_name = newPath + ".md";
    newPath = "qms/" + "prod" + "/" + newPath + "/" + file_name;

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

    const newContent = [...products];
    newContent.push({
      branchId: uniqueId,
      sortOrder: products?.length || 1,
      author: authors,
      approver: approvers,
      reader: readers,
      sops: linkedSops,
    });

    console.log(newContent);

    const commitMessage = "initial commit";
    const result = await saveToDatabase({
      collectionName: "products",
      projectId: project.id,
      repositoryId: repository.id,
      newContent: JSON.stringify(newContent),
      commitMessage,
    });

    if (result) {
      setAlertMessage({ message: "Product Created...", severity: "success" });
    } else {
      setAlertMessage({
        message: "Product Creation failed...",
        severity: "error",
      });
    }

    setName("");
    setNumber("");
    // get the object id of the folder for navigation
    const objectId = await setFileNames(
      repository?.id,
      uniqueId,
      branchName,
      "prod"
    );
    refreshProductDBData(project.id, project.name, repository.id);
    handleCancel();
  }

  function handleCancel() {
    setName("");
    setNumber("");
    // navigate("/qmshub.html/");
    setOpen(false);
  }

  React.useEffect(() => {
    // This is required to load the sops for the dropdown..
    if (repository && repository?.id) {
      branchTypes["sop"]?.map((branch) => {
        setFileNames(repository?.id, branch.branchId, branch.name, "sop");
      });
    }
  }, [repository, branchTypes]);
  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ paddingTop: "12px" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          paddingTop: "12px",
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
          <Box>
            <Typography
              variant="h6"
              sx={{
                alignSelf: "flex-start",
                paddingBottom: "24px",
                paddingTop: "12px",
              }}
            >
              Create Product
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl sx={{ m: 1, width: 300 }}>
              <TextField
                helperText="Please enter product name"
                id="name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></TextField>
            </FormControl>
            <FormControl sx={{ m: 1, width: 300 }}>
              <TextField
                helperText="Please enter product number"
                id="number"
                label="Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              ></TextField>
            </FormControl>
            <Typography sx={{ fontSize: "12px", color: "red" }}>
              {error}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl sx={{ m: 1, width: 300, maxHeight: 200 }}>
              <InputLabel id="linkedSops">SOPs to link</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-labelsop"
                id="demo-multiple-checkbox"
                multiple
                value={linkedSops}
                onChange={handleLinkedSopsChange}
                input={<OutlinedInput label="Linked SOPs" />}
                // renderValue={(selected) => selected.join(", ")}
              >
                {branchFileNames
                  .filter((item) => item.type === "sop")
                  .map((sop) => (
                    <MenuItem key={sop.branchId} value={sop.branchId}>
                      <Checkbox
                        checked={linkedSops.indexOf(sop?.branchId) > -1}
                      />
                      <ListItemText primary={sop?.relativePath} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="approverTeams">Approver Teams</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={approvers}
                onChange={handleApproverChange}
                input={<OutlinedInput label="Approver Teams" />}
                renderValue={(selected) =>
                  selected
                    ?.map(
                      (item) =>
                        teamsWithMembers?.find((team) => team.id === item)?.name
                    )
                    .join(", ")
                }
              >
                {teamsWithMembers.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    <Checkbox checked={approvers.indexOf(team?.id) > -1} />
                    <ListItemText primary={team?.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="authorTeams">Author Teams</InputLabel>
              <Select
                labelId="authorTeams"
                id="authorselect"
                multiple
                value={authors}
                onChange={handleAutherChange}
                input={<OutlinedInput label="Author Teams" />}
                renderValue={(selected) =>
                  selected
                    ?.map(
                      (item) =>
                        teamsWithMembers?.find((team) => team.id === item)?.name
                    )
                    .join(", ")
                }
              >
                {teamsWithMembers.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    <Checkbox checked={authors.indexOf(team?.id) > -1} />
                    <ListItemText primary={team?.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="readerTeams">Reader Teams</InputLabel>
              <Select
                labelId="readerTeams"
                id="readerselect"
                multiple
                value={readers}
                onChange={handleReaderChange}
                input={<OutlinedInput label="Reader Teams" />}
                renderValue={(selected) =>
                  selected
                    ?.map(
                      (item) =>
                        teamsWithMembers?.find((team) => team.id === item)?.name
                    )
                    .join(", ")
                }
              >
                {teamsWithMembers.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    <Checkbox checked={readers.indexOf(team?.id) > -1} />
                    <ListItemText primary={team?.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

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
