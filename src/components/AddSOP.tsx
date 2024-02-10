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
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useExtnStore } from "../zustand/store";
import useCreateBranch from "../CHooks/useCreateBranch";
import useCommit from "../CHooks/useCommit";
import { v4 as uuidv4 } from "uuid";

import { versionIncreaser } from "../utils/DOMHelpers";
export default function AddSOP({
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
  const [reviewers, setReviewers] = React.useState([]);
  const [authors, setAuthors] = React.useState([]);

  const {
    branchFileNames,
    repository,
    setBranches,
    getFileContent,
    teamsWithMembers,
    saveToDatabase,
    sops,
    refreshSOPDBData,
    setAlertMessage,
    userSOPs,
  } = useExtnStore((state) => state);

  const { renameFile, loadingRenameFile, commit } = useCommit();
  const navigate = useNavigate();
  const { createBranch, loading, branchCreated } = useCreateBranch();
  const project = useExtnStore((state) => state.project);
  const [valueTemplate, setValueTemplate] = useState("baseTemplate");
  const [selectedSOPTemplate, setSelectedSOPTemplate] = useState("");
  const handleApproverChange = (event) => {
    const {
      target: { value },
    } = event;
    setApprovers(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleAuthorChange = (event) => {
    const {
      target: { value },
    } = event;
    setAuthors(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  function handleTemplateTypeChange(e) {
    setValueTemplate(e.target.value);
  }
  const handleReviewerChange = (event) => {
    const {
      target: { value },
    } = event;
    setReviewers(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  async function getFileContentData() {
    let newBranchName;
    let filePath;
    if (valueTemplate === "baseTemplate") {
      newBranchName = "qms/basetemplates/main";

      filePath = "/sop.html";
    } else {
      if (selectedSOPTemplate) {
        const sop = userSOPs?.find(
          (item) => item.branchId === selectedSOPTemplate
        );
        newBranchName = sop.name;
        filePath = `qms/${sop.type}/data.html`;
      } else {
        return;
      }
    }

    const content = await getFileContent(
      repository.id,
      filePath,
      newBranchName,
      null
    );

    return content || "";
    // setInputText(content);
  }
  async function handleCreate() {
    const sopNamedata = `${number}_${name}`;
    // replace spaces with underscores- branch name should not have spaces
    const sopName = sopNamedata.replace(/ /g, "_");

    // create unique id for the sop branch name
    const uniqueId = uuidv4();
    const branchName = `qms/sop/${uniqueId}/${sopName}/main`;
    const res = await createBranch(
      project.id,
      repository.id,
      "main",
      branchName
    );

    const file_name = "data.html";
    const path = `qms/sop/${file_name}`;

    const renameRes = await renameFile(
      project.id,
      repository.id,
      branchName,
      "/README.md",
      path,
      "rename default README.md file"
    );
    if (renameRes) {
      // setBranches(repository.id);
      const commitMessage = "initial commit..";

      const content = await getFileContentData();
      const versionIncreased = versionIncreaser(content);

      const createdData = await commit(
        project.id,
        repository.id,
        branchName,
        path,
        versionIncreased,
        commitMessage
      );

      if (createdData) {
        const newContent = [...sops];
        newContent.push({
          branchId: uniqueId,
          sortOrder: sops.length,
          author: authors,
          approver: approvers,
          reviewer: reviewers,
        });

        const commitMessage = "initial commit";
        const result = await saveToDatabase({
          collectionName: "sops",
          projectId: project.id,
          repositoryId: repository.id,
          newContent: JSON.stringify(newContent),
          commitMessage,
        });

        if (result) {
          setAlertMessage({ message: "SOP Created...", severity: "success" });
        } else {
          setAlertMessage({
            message: "SOP Creation not successfull...",
            severity: "error",
          });
        }
      }
    }

    setName("");
    setNumber("");

    refreshSOPDBData(project.id, project.name, repository.id);
    handleCancel();
  }

  function handleCancel() {
    setName("");
    setNumber("");
    // navigate("/qmshub.html/");
    setOpen(false);
  }
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "800px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>SOP Creation</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px",
            margin: "9px",
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
            <FormControl sx={{ m: 1, width: 300 }}>
              <TextField
                helperText="Please enter SOP name"
                id="name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></TextField>
            </FormControl>
            <FormControl sx={{ m: 1, width: 300 }}>
              <TextField
                helperText="Please enter SOP number"
                id="number"
                label="Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              ></TextField>
            </FormControl>
            <Typography sx={{ fontSize: "12px", color: "red" }}>
              {error}
            </Typography>
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Choose template type
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                row
                value={valueTemplate}
                onChange={handleTemplateTypeChange}
              >
                <FormControlLabel
                  value="baseTemplate"
                  control={<Radio />}
                  label="Base Template"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>
            {valueTemplate === "other" && (
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="templateSelector">
                  Select and SOP Template
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-labeltemp"
                  id="demo-multiple-checkboxtemp"
                  value={selectedSOPTemplate}
                  onChange={(e) => setSelectedSOPTemplate(e.target.value)}
                  input={<OutlinedInput label="Approver Teams" />}
                  // renderValue={(selected) =>
                  //   selected
                  //     ?.map(
                  //       (item) =>
                  //         teamsWithMembers?.find((team) => team.id === item)
                  //           ?.name
                  //     )
                  //     .join(", ")
                  // }
                >
                  {userSOPs.map((sop) => (
                    <MenuItem key={sop.branchId} value={sop.branchId}>
                      {sop.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

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

            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="approverTeams">Reviewer Teams</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={reviewers}
                onChange={handleReviewerChange}
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
                    <Checkbox checked={reviewers.indexOf(team?.id) > -1} />
                    <ListItemText primary={team?.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="authorTeams">Author Teams</InputLabel>
              <Select
                labelId="authorTeams"
                id="authorselect"
                multiple
                value={authors}
                onChange={handleAuthorChange}
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
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
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
            disabled={
              loading ||
              loadingRenameFile ||
              (valueTemplate === "other" && !selectedSOPTemplate)
            }
            variant="contained"
            color="primary"
            onClick={handleCreate}
          >
            Create
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
