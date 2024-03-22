import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import Modal from "@mui/material/Modal";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { useState } from "react";
import { useExtnStore } from "../zustand/store";
import { updateVote, voteStatus } from "../utils/gitHelpers.js";
export default function ApprovalModal({
  open,
  setOpen,
  branchId,
  sopName,
  pullRequest,
  myApprovalPending,
  myReviewPending,
  pullRequestStatus,
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showApprovers, setShowApprovers] = useState(false);
  const {
    repository,
    currentUser,
    refreshSOPDBData,
    project,
    setAlertMessage,
  } = useExtnStore((state) => state);

  async function handleApproval(vote) {
    setLoading(true);
    const currentReviewer = pullRequest?.reviewers?.find(
      (reviewer) => reviewer?.id === currentUser?.id
    );

    try {
      const res = await updateVote(
        repository?.id,
        pullRequest?.pullRequestId,
        currentReviewer?.id,
        vote
      );
      await refreshSOPDBData(project.id, project.name, repository.id);
      setLoading(false);
      handleCancel();
    } catch (e) {
      setLoading(false);
      setAlertMessage({
        showAlert: true,
        message: "Some error occured..",
      });
    }
  }
  const enableApprove = () => {
    let result = false;

    result =
      (myApprovalPending?.hasPrivilege && myApprovalPending?.isPending) ||
      (myReviewPending?.hasPrivilege && myReviewPending?.isPending);

    return result;
  };

  function handleCancel() {
    setMessage("");
    setOpen(false);
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
                label={`${showApprovers ? "Hide" : "Show"} Approval Chain`}
              ></FormControlLabel>
              {showApprovers && (
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                  }}
                >
                  {pullRequest?.reviewers?.map((item) => (
                    <Box key={item?.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt={item.displayName} src={item.imageUrl} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item?.uniqueName}
                          secondary={
                            <>
                              {voteStatus
                                ?.filter(
                                  (votest) => votest?.vote === item?.vote
                                )
                                ?.map((val) => (
                                  <Chip
                                    key={`${item.id}_${val.status}`}
                                    label={val.status}
                                    color={val?.color}
                                  />
                                ))}
                              <Chip
                                label={
                                  pullRequestStatus?.find(
                                    (stat) => stat?.context?.name === item?.id
                                  )?.context?.genre
                                }
                              ></Chip>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider></Divider>
                    </Box>
                  ))}
                </List>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Modal>
  );
}
