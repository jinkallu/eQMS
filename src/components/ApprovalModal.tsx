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
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  FormControlLabel,
  Switch,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import React from "react";
import { useExtnStore } from "../zustand/store";
import { updateVote, voteStatus } from "../utils/gitHelpers.js";
export default function ApprovalModal({
  open,
  setOpen,
  branchId,
  sopName,
  pullRequest,
  canVote,
}) {
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showApprovers, setShowApprovers] = React.useState(false);
  const {
    branchFileNames,
    repository,
    currentUser,
    setBranches,
    userSOPs,
    sops,
    saveToDatabase,
    refreshSOPDBData,
    setAlertMessage,
    teamsWithMembers,
    project,
  } = useExtnStore((state) => state);

  async function handleApproval(vote) {
    setLoading(true);
    const currentReviewer = pullRequest?.reviewers?.find(
      (reviewer) => reviewer?.id === currentUser?.id
    );

    const res = await updateVote(
      repository?.id,
      pullRequest?.pullRequestId,
      currentReviewer?.id,
      vote
    );
    await refreshSOPDBData(project.id, project.name, repository.id);
    setLoading(false);
    handleCancel();
  }
  const enableApprove = () => {
    let result = false;
    if (pullRequest?.reviewers?.find((item) => item.id === currentUser.id)) {
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
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            paddingX: "24px",
            paddingY: "24px",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingX: "24px",
              paddingY: "24px",
              flexDirection: "column",
              gap: "12px",
              height: "100%",
              minWidth: 400,
            }}
          >
            <HighlightOffIcon
              sx={{ alignSelf: "flex-end", cursor: "pointer" }}
              onClick={() => setOpen(false)}
            ></HighlightOffIcon>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Chip label={sopName} color="primary"></Chip>
            </Box>

            {enableApprove() && (
              <Box>
                <Typography
                  sx={{
                    alignSelf: "flex-start",
                    paddingY: "12px",
                    fontSize: "14px",
                    fontWeight: 600,
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
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    disabled={loading}
                    color="error"
                    onClick={() => handleApproval(-10)}
                  >
                    Reject
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={loading}
                    color="primary"
                    onClick={() => handleApproval(5)}
                  >
                    Approve
                  </Button>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              <Divider></Divider>
              <FormControlLabel
                control={
                  <Switch
                    checked={showApprovers}
                    onChange={() => setShowApprovers((prev) => !prev)}
                  ></Switch>
                }
                label={`${showApprovers ? "Hide" : "Show"} Approval Data`}
              ></FormControlLabel>
              {showApprovers && (
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                  }}
                >
                  {pullRequest?.reviewers?.map((item) => (
                    <>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt={item.displayName} src={item.imageUrl} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item?.uniqueName}
                          secondary={
                            <React.Fragment>
                              {voteStatus
                                ?.filter(
                                  (votest) => votest?.vote === item?.vote
                                )
                                ?.map((val) => (
                                  <Chip label={val.status} color={val?.color} />
                                ))}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider></Divider>
                    </>
                  ))}
                </List>
              )}
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
      </Box>
    </Modal>
  );
}
