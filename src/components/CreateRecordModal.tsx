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
  ListItemText,
  OutlinedInput,
  Checkbox,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { useExtnStore } from "../zustand/store";
import { createPR } from "../utils/gitHelpers.js";
//import Editor from "./marked/Editor";
//import useMarkdToHTML from "./marked/useMarkdToHTML";
import RecordView from "./Pages/RecordView";

export default function CreateRecordModal({
  open,
  setOpen,
  stepName,
  handleCreate,
  currentTemplateId,
  stepSelector,
  setCurrentTemplateId,
}) {
  const [title, setTitle] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { getFileContent, branchTypes, repository } = useExtnStore();
  const [approverList, setApproverList] =
    React.useState<{ uniqueName: string; url: string; selected: boolean }[]>();

  const [md, setMd] = React.useState("");

  const [selectedApprovers, setSeletedApprovers] = React.useState([]);

  // const rev

  async function getFileData(repositoryId, path, branchName) {
    const data = await getFileContent(repositoryId, path, branchName);
    console.log(data);
    setMd(data);
  }

  React.useEffect(() => {
    if (!currentTemplateId || !repository?.id) return;

    const branch = branchTypes["temp"]?.find(
      (item) => item.branchId === currentTemplateId
    );
    if (branch) {
      getFileData(repository.id, branch?.filePath, branch?.name);
    }
  }, [currentTemplateId, repository, branchTypes]);

  React.useEffect(() => {
    if (stepSelector?.length > 0) {
      setCurrentTemplateId(stepSelector[0]?.templateId);
    }
  }, [stepSelector]);

  function handleCancel() {
    setTitle("");
    setOpen(false);
    // navigate("/qmshub.html/");
  }

  function handleSelectChange(e) {
    const templateId = stepSelector?.find(
      (item) => item.templateId === e.target.value
    )?.templateId;
    setCurrentTemplateId(templateId);
  }
  // const md = "# Hello give here proper md from the template! <input>";
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
            <Chip label={stepName} color="primary"></Chip>
          </Box>
          <Typography
            variant="h6"
            sx={{
              alignSelf: "flex-start",
              paddingBottom: "24px",
              paddingTop: "12px",
            }}
          >
            Create new
          </Typography>
          {stepSelector?.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Template
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currentTemplateId}
                label="template"
                onChange={handleSelectChange}
              >
                {stepSelector?.map((item) => (
                  <MenuItem value={item.templateId}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl sx={{ m: 1, width: 300 }}>
            <TextField
              helperText="Please enter a message to describe the changes"
              id="number"
              label="Record Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></TextField>
            <RecordView md={md} />
          </FormControl>

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
              variant="contained"
              color="primary"
              onClick={() => handleCreate(title)}
              disabled={loading}
            >
              Create record
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
}
