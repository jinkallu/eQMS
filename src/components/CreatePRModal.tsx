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
import { createPR, addPullRequestStatus } from "../utils/gitHelpers.js";
export default function CreatePRModal({ open, setOpen, branchId, sopName }) {
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [approverList, setApproverList] =
    React.useState<{ uniqueName: string; url: string; selected: boolean }[]>();

  const [reviewerList, setReviewerList] =
    React.useState<{ uniqueName: string; url: string; selected: boolean }[]>();

  const [selectedApprovers, setSeletedApprovers] = React.useState([]);
  const [selectedReviewers, setSeletedReviewers] = React.useState([]);

  const {
    branchFileNames,
    repository,
    setBranches,
    userSOPs,
    sops,
    saveToDatabase,
    setAlertMessage,
    teamsWithMembers,
    project,
    currentUser,
    refreshSOPDBData,
  } = useExtnStore((state) => state);

  React.useEffect(() => {
    const approverListData = [];
    const reviewerListData = [];
    const currentSOP = sops?.find((sop) => sop.branchId === branchId);
    // set approver list
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
    // set reviewer list
    currentSOP?.reviewer?.map((reviewerTeam) => {
      const team = teamsWithMembers?.find((team) => team?.id === reviewerTeam);
      if (team) {
        team?.members?.map((member) => {
          const existing = reviewerListData?.find(
            (item) => item?.uniqueName === member?.identity?.uniqueName
          );
          if (!existing) {
            reviewerListData.push({
              uniqueName: member?.identity?.uniqueName,
              url: member?.identity?.id,
              selected: false,
            });
          }
          return member;
        });
      }
      return reviewerTeam;
    });

    setReviewerList(reviewerListData);
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

  const handleReviewerChange = (event) => {
    const {
      target: { value },
    } = event;
    setSeletedReviewers(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  // function handleApproverSelectChange(e) {
  //   const newApprovers = approverList?.map((item) => {
  //     if (item.url === e.target.value) {
  //       return { ...item, selected: !item.selected };
  //     }
  //     return item;
  //   });
  //   setApproverList(newApprovers);
  // }
  async function handleCreatePR() {
    if (!message || !selectedApprovers) {
      setError("All inputs are mandatory");
      return;
    }

    setLoading(true);

    const approverList = selectedApprovers?.map((approver) => {
      return {
        id: approver,
        isRequired: true,
        status: {
          context: {
            name: approver,
            genre: "Approver",
          },
          state: "pending", // or "pending", "failed", "error", "notSet"
          description: "Approval status",
        },
      };
    });

    const reviewerList = selectedReviewers?.map((reviewer) => {
      return {
        id: reviewer,
        isRequired: true,

        status: {
          context: {
            name: reviewer,
            genre: "Reviewer",
          },
          state: "pending", // or "pending", "failed", "error", "notSet"
          description: "Reviewal status",
        },
      };
    });

    const reviewers = [...approverList, ...reviewerList];

    // const reviewers = selectedApprovers?.join(";");

    const sourceBranch = `qms/sop/${branchId}/${sopName}/edit`;
    const targetBranch = `qms/sop/${branchId}/${sopName}/main`;
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

    console.log(res);
    if (res) {
      const voteRes = await Promise.all(
        reviewers?.map(async (item) => {
          await addPullRequestStatus(
            item?.status,
            repository?.id,
            res?.pullRequestId
          );
          return item;
        })
      );
      console.log(voteRes)

      if (voteRes)
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

    await refreshSOPDBData(project?.id, project.name, repository.id);
    setLoading(false);
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

          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="reviewerTeams">Reviewers</InputLabel>
            <Select
              labelId="review-multiple-checkbox-label"
              id="review-multiple-checkbox"
              multiple
              value={selectedReviewers}
              onChange={handleReviewerChange}
              input={<OutlinedInput label="Choose Reviewers" />}
              renderValue={(selected) =>
                selected
                  ?.map(
                    (item) =>
                      reviewerList?.find((reviewer) => reviewer.url === item)
                        ?.uniqueName
                  )
                  .join(", ")
              }
            >
              {reviewerList?.map((reviewer) => (
                <MenuItem key={reviewer?.url} value={reviewer?.url}>
                  <Checkbox
                    checked={selectedReviewers.indexOf(reviewer?.url) > -1}
                  />
                  <ListItemText primary={reviewer?.uniqueName} />
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
              disabled={loading}
            >
              Send for Approval
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
}
