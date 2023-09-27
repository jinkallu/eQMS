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
export default function CreatePRModal({ open, setOpen, branchId, sopName }) {
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [approverList, setApproverList] =
    React.useState<{ uniqueName: string; url: string; selected: boolean }[]>();

  const [selectedApprovers, setSeletedApprovers] = React.useState([]);

  const {
    branchFileNames,
    repository,
    setBranches,
    setFileNames,
    userSOPs,
    sops,
    saveToDatabase,
    refreshDBData,
    setAlertMessage,
    teamsWithMembers,
    project,
    currentUser,
  } = useExtnStore((state) => state);

  React.useEffect(() => {
    const approverListData = [];
    const currentSOP = sops?.find((sop) => sop.branchId === branchId);
    currentSOP?.approver?.map((approverTeam) => {
      const team = teamsWithMembers?.find((team) => team?.id === approverTeam);
      if (team) {
        team?.members?.map((member) => {
          const existing = approverListData?.find(
            (item) => item?.uniqueName === member?.identity?.uniqueName
          );
          if (!existing) {
            approverListData.push({
              uniqueName: member?.identity?.uniqueName,
              url: member?.identity?.id,
              selected: false,
            });
          }
          return member;
        });
      }
      return approverTeam;
    });

    setApproverList(approverListData);
  }, [sops, teamsWithMembers, branchId]);

  const handleApproverChange = (event) => {
    const {
      target: { value },
    } = event;
    setSeletedApprovers(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  function handleApproverSelectChange(e) {
    const newApprovers = approverList?.map((item) => {
      if (item.url === e.target.value) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    setApproverList(newApprovers);
  }
  async function handleCreatePR() {
    if (!message || !selectedApprovers) {
      setError("All inputs are mandatory");
      return;
    }

    const reviewers = selectedApprovers?.map((approver) => {
      return {
        id: approver,
        isRequired: true,
      };
    });

    // const reviewers = selectedApprovers?.join(";");

    const sourceBranch = `qms/sop/${branchId}/edit`;
    const targetBranch = `qms/sop/${branchId}/main`;
    const title = "Test pull Request";

    const res = await createPR(
      project.id,
      repository.id,
      sourceBranch,
      targetBranch,
      title,
      message,
      reviewers,
      currentUser.id
    );
    if (res) {
      setAlertMessage({
        message: "SOP send for approval...",
        severity: "success",
      });
    } else {
      setAlertMessage({
        message: "SOP forwarding failed...",
        severity: "error",
      });
    }
    handleCancel();
  }

  function handleCancel() {
    setMessage("");
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
            Forward SOP for Approval
          </Typography>
          <FormControl sx={{ m: 1, width: 300 }}>
            <TextField
              helperText="Please enter a message to describe the changes"
              id="number"
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></TextField>
          </FormControl>

          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="approverTeams">Approvers</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={selectedApprovers}
              onChange={handleApproverChange}
              input={<OutlinedInput label="Choose Approvers" />}
              renderValue={(selected) =>
                selected
                  ?.map(
                    (item) =>
                      approverList?.find((approver) => approver.url === item)
                        ?.uniqueName
                  )
                  .join(", ")
              }
            >
              {approverList?.map((approver) => (
                <MenuItem key={approver?.url} value={approver?.url}>
                  <Checkbox
                    checked={selectedApprovers.indexOf(approver?.url) > -1}
                  />
                  <ListItemText primary={approver?.uniqueName} />
                </MenuItem>
              ))}
            </Select>
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
              onClick={handleCreatePR}
            >
              Send for Approval
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
}
