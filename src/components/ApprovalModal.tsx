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
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import React from "react";
import { useExtnStore } from "../zustand/store";
import { updateVote, voteStatus } from "../utils/gitHelpers.js";
import MarkedToCustom from "./marked/MarkedToCustom";

export default function ApprovalModal({
  open,
  setOpen,
  branchId,
  sopName,
  pullRequest,
  myApprovalPending,
  myReviewPending,
  pullRequestStatus,
  branchName,
  type,
  diffInfo,
}) {
  const [message, setMessage] = React.useState("");
  const [htmlTextMain, setTextHtmlMain] = React.useState("");
  const [htmlTextEdit, setHtmlTextEdit] = React.useState("");
  const [diffText, setDiffText] = React.useState([]);
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
    getFileContent,
  } = useExtnStore((state) => state);

  async function getFileContentData(edit) {
    let newBranchName = branchName;

    let lastIndex = branchName.lastIndexOf("/main");

    if (edit) {
      //Replace the last occurrence with "/edit"
      newBranchName =
        branchName.substring(0, lastIndex) +
        "/edit" +
        branchName.substring(lastIndex + "/main".length);
    }

    const content = await getFileContent(
      repository.id,
      `/qms/${type}/data.html`,
      newBranchName
    );

    if (content && content.trim() !== "") {
      // const parser = new DOMParser();
      // const htmlData = parser.parseFromString(content, "text/html");

      if (edit) {
        setHtmlTextEdit(content);
      } else {
        setTextHtmlMain(content);
      }
      // setHtml(htmlData);
    }

    // setInputText(content);
  }

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
    // if (pullRequest?.reviewers?.find((item) => item.id === currentUser.id)) {
    //   result = true;
    // }

    result =
      (myApprovalPending?.hasPrivilege && myApprovalPending?.isPending) ||
      (myReviewPending?.hasPrivilege && myReviewPending?.isPending);

    return result;
  };

  function handleCancel() {
    setMessage("");
    setOpen(false);
    // navigate("/qmshub.html/");
  }

  function getTextColor(val, isMain) {
    if (val === 1) {
      return "red";
    }
    if (val === 3) {
      if (isMain) return "red";
      return "green";
    }
    return "black";
  }

  React.useEffect(() => {
    if (open && branchName && repository) {
      getFileContentData(false);
      getFileContentData(true);
    }
  }, [repository, branchName, open]);

  const editLines = htmlTextEdit?.split("\n");
  const mainLines = htmlTextMain?.split("\n");

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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "90vw",
                maxHeight: "50vh",
                overflow: "auto",
              }}
            >
              {diffInfo?.map((diff) => {
                return (
                  <Box sx={{ pading: "0px" }}>
                    {Array.from(Array(diff?.originalLinesCount).keys())?.map(
                      (cnt) => (
                        <h4
                          style={{
                            paddingTop: "0px",
                            paddingBottom: "0px",
                            color: getTextColor(diff?.changeType, true),
                          }}
                        >
                          {mainLines[diff.originalLineNumberStart - 1 + +cnt]}
                        </h4>
                      )
                    )}
                    {Array.from(Array(diff?.modifiedLinesCount).keys())?.map(
                      (cnt) =>
                        diff?.changeType !== 0 && (
                          <h4
                            style={{
                              paddingTop: "0px",
                              paddingBottom: "0px",
                              color: getTextColor(diff?.changeType, false),
                            }}
                          >
                            {editLines[diff.modifiedLineNumberStart - 1 + +cnt]}
                          </h4>
                        )
                    )}
                  </Box>
                );
              })}

              {/* 
              <p>
                {diffText &&
                  diffText?.map((item, index) => (
                    <span key={index} style={{ color: getTextColor(item[0]) }}>
                      {item[1]}
                    </span>
                  ))}
              </p> */}
            </Box>

            <MarkedToCustom
              key={"base"}
              element={""}
              open={null}
              setOpen={null}
              order="last"
              productId={null}
            ></MarkedToCustom>

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
                            <React.Fragment>
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
                            </React.Fragment>
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
