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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import React from "react";
import { useExtnStore } from "../zustand/store";
import { updateVote } from "../utils/gitHelpers.js";
export default function ApprovalModal({
  open,
  setOpen,
  branchId,
  sopName,
  pullRequest,
}) {
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const {
    branchFileNames,
    repository,
    currentUser,
    setBranches,
    setFileNames,
    userSOPs,
    sops,
    saveToDatabase,
    refreshDBData,
    setAlertMessage,
    teamsWithMembers,
    project,
  } = useExtnStore((state) => state);

  async function handleApproval(vote) {
    setLoading(true);
    console.log(pullRequest);
    const currentReviewer = pullRequest?.reviewers?.find(
      (reviewer) => reviewer?.id === currentUser?.id
    );

    const res = await updateVote(
      repository?.id,
      pullRequest?.pullRequestId,
      currentReviewer?.id,
      vote
    );
    await refreshDBData(project.id, project.name, repository.id);
    setLoading(false);
    handleCancel();
  }
  const enableApprove = () => {
    let result = false;
    if (
      pullRequest?.reviewers?.find(
        (item) => item.id === currentUser.id && item?.vote !== 0
      )
    ) {
      result = true;
    }

    return result;
  };

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
          width: "100%",
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
            SOP Approval
          </Typography>
          <FormControl sx={{ m: 1, width: 300 }}>
            <TextField
              helperText="Please enter an approval message"
              id="number"
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></TextField>
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
              size="small"
              variant="contained"
              disabled={enableApprove() || loading}
              color="primary"
              onClick={() => handleApproval(-10)}
            >
              Reject
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={enableApprove() || loading}
              color="primary"
              onClick={() => handleApproval(5)}
            >
              Approve
            </Button>
          </Box>
        </Paper>
        {/* <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Accordion 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion> */}
      </Box>
    </Modal>
  );
}
