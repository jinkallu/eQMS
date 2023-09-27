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

  // React.useEffect(() => {
  //   const approverListData = [];
  //   const currentSOP = sops?.find((sop) => sop.branchId === branchId);
  //   console.log(currentSOP);
  //   currentSOP?.approver?.map((approverTeam) => {
  //     const team = teamsWithMembers?.find((team) => team?.id === approverTeam);
  //     if (team) {
  //       team?.members?.map((member) => {
  //         const existing = approverListData?.find(
  //           (item) => item?.uniqueName === member?.identity?.uniqueName
  //         );
  //         if (!existing) {
  //           approverListData.push({
  //             uniqueName: member?.identity?.uniqueName,
  //             url: member?.identity?.id,
  //             selected: false,
  //           });
  //         }
  //         return member;
  //       });
  //     }
  //     return approverTeam;
  //   });

  //   setApproverList(approverListData);
  // }, [sops, teamsWithMembers, branchId]);

  // const handleApproverChange = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setSeletedApprovers(
  //     // On autofill we get a stringified value.
  //     typeof value === "string" ? value.split(",") : value
  //   );
  // };

  // function handleApproverSelectChange(e) {
  //   const newApprovers = approverList?.map((item) => {
  //     if (item.url === e.target.value) {
  //       return { ...item, selected: !item.selected };
  //     }
  //     return item;
  //   });
  //   setApproverList(newApprovers);
  // }
  // async function handleCreatePR() {
  //   if (!message || !selectedApprovers) {
  //     setError("All inputs are mandatory");
  //     return;
  //   }

  //   const reviewers = selectedApprovers?.map((approver) => {
  //     return {
  //       id: approver,
  //       isRequired: true,
  //     };
  //   });

  //   // const reviewers = selectedApprovers?.join(";");

  //   const sourceBranch = `qms/sop/${branchId}/edit`;
  //   const targetBranch = `qms/sop/${branchId}/main`;
  //   const title = "Test pull Request";

  //   const res = await createPR(
  //     project.id,
  //     repository.id,
  //     sourceBranch,
  //     targetBranch,
  //     title,
  //     message,
  //     reviewers
  //   );
  //   if (res) {
  //     setAlertMessage({
  //       message: "SOP send for approval...",
  //       severity: "success",
  //     });
  //   } else {
  //     setAlertMessage({
  //       message: "SOP forwarding failed...",
  //       severity: "error",
  //     });
  //   }
  //   handleCancel();
  // }

  async function handleApproval() {
    console.log(pullRequest);
    const currentReviewer = pullRequest?.reviewers?.find(
      (reviewer) => reviewer?.id === currentUser?.id
    );

    const res = await updateVote(
      repository?.id,
      pullRequest?.pullRequestId,
      currentReviewer?.id,
      5
    );
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
              variant="contained"
              disabled={enableApprove()}
              color="primary"
              onClick={handleApproval}
            >
              Approve
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
}
