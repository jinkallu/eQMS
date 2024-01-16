import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { useExtnStore } from "../zustand/store";
import { createPR } from "../utils/gitHelpers.js";

import {
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Paper,
  Typography,
  CardHeader,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { createSearchParams, useNavigate } from "react-router-dom";
import TemplateCRUD from "./TemplateCRUD";
import CreatePRModal from "./CreatePRModal";
import ApprovalIcon from "@mui/icons-material/Approval";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PreviewIcon from "@mui/icons-material/Preview";

import VerifiedIcon from "@mui/icons-material/Verified";
import ApprovalModal from "./ApprovalModal";

export default function SOPCard({ sop, edit }) {
  const { branchFileNames, currentUser, teamsWithMembers } = useExtnStore(
    (state) => state
  );
  const [openAddTemplateModal, setOpenAddTemplateModal] = React.useState(false);
  const [openApprovalModal, setOpenApprovalModal] = React.useState(false);
  const [openCreatePRModal, setOpenCreatePRModal] = React.useState(false);
  const [enableApproval, setEnableApproval] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  let canEdit = false;
  sop?.author?.map((author) => {
    const member = teamsWithMembers
      ?.find((item) => item.id === author)
      ?.members?.find((item) => item?.identity?.id === currentUser?.id);
    if (member) {
      canEdit = true;
    }
    return author;
  });

  const navigate = useNavigate();

  async function handleItemClick(branch) {
    navigate({
      pathname: "/qmshub.html/content/",
      search: `?${createSearchParams({
        // objectId: branch?.objectId,
        relativePath: branch?.relativePath,
        type: branch?.type,
        branchName: branch?.name,
        canEdit: canEdit ? "yes" : "no",
      })}`,
    });
  }

  function handleAddTempClick(e, branch) {
    e.stopPropagation();
    navigate({
      pathname: "/qmshub.html/addtemp",
      search: `?${createSearchParams({
        branchId: branch?.branchId,
        name: branch?.relativePath,
      })}`,
    });
  }

  function handleCreatePR() {
    handleClose();
    setOpenCreatePRModal(true);

    // createPR((
    //   projectId,
    //   repositoryId,
    //   sourceBranch,
    //   targetBranch,
    //   title,
    //   description)
  }

  React.useEffect(() => {
    let result = false;
    if (
      sop?.pullRequest?.reviewers?.find(
        (item) => item.id === currentUser.id && item?.vote === 0
      )
    ) {
      result = true;
    }
    setEnableApproval(result);
  }, [sop, currentUser]);

  return (
    <Box>
      <TemplateCRUD
        open={openAddTemplateModal}
        setOpen={setOpenAddTemplateModal}
        branchId={sop?.branchId}
        sopName={sop?.relativePath}
      ></TemplateCRUD>

      <CreatePRModal
        open={openCreatePRModal}
        setOpen={setOpenCreatePRModal}
        branchId={sop?.branchId}
        sopName={sop?.relativePath}
      ></CreatePRModal>

      <ApprovalModal
        open={openApprovalModal}
        setOpen={setOpenApprovalModal}
        pullRequest={sop?.pullRequest}
        branchId={sop?.branchId}
        sopName={sop?.relativePath}
        canVote={enableApproval}
        pullRequestStatus={[]}
      ></ApprovalModal>
      <Card
        variant="outlined"
        sx={{ "&:hover": { border: "2px solid #082567" } }}
      >
        {edit && (
          <Box sx={{ height: "5px", backgroundColor: " #082567" }}></Box>
        )}
        <CardHeader
          sx={{ paddingBottom: "5px" }}
          avatar={
            <Avatar aria-label="recipe" sx={{ backgroundColor: "#082567" }}>
              <Typography sx={{ fontSize: "12px" }}>{sop?.number}</Typography>
            </Avatar>
          }
          title=<Tooltip title="Click to view SOP">
            <Typography
              sx={{
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: "#082567",
              }}
              onClick={() => handleItemClick(sop)}
            >
              {sop?.title}
            </Typography>
          </Tooltip>
        />
        <CardContent sx={{ paddingBottom: "5px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, paddingLeft: "5px" }}
              color="success"
            >
              {`Templates (${sop?.templates?.length || 0})`}
            </Typography>
            {sop?.author?.length > 0 && (
              <Tooltip title="Add Template">
                <AddIcon
                  sx={{ cursor: "pointer" }}
                  onClick={() => setOpenAddTemplateModal(true)}
                ></AddIcon>
              </Tooltip>
            )}
          </Box>
          <Box
            sx={{
              height: 100,
              overflow: "auto",
              borderLeft: "1px solid indigo",
              paddingTop: "5px",
            }}
          >
            <List
              dense={true}
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 300,
              }}
            >
              {sop?.templates?.length > 0 ? (
                sop?.templates?.map((template) => {
                  // const tempBranch = branchFileNames.find(
                  //   (item) => item.type === "temp" && item.branchId === template
                  // );

                  return (
                    <ListItem
                      key={template?.branchId}
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "grey" },
                      }}
                      onClick={() => handleItemClick(template)}
                    >
                      <ListItemText primary={template?.title} />
                    </ListItem>
                  );
                })
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: 12 }}>
                    No templates available
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        </CardContent>

        <CardActions disableSpacing>
          <Tooltip title="View SOP">
            <IconButton aria-label="share" onClick={() => handleItemClick(sop)}>
              <PreviewIcon color="primary" />
            </IconButton>
          </Tooltip>

          {Boolean(sop?.pullRequest) && (
            <Tooltip
              title={enableApproval ? "Approval" : "View Approval status"}
            >
              <IconButton
                aria-label="add to favorites"
                onClick={() => setOpenApprovalModal(true)}
              >
                {enableApproval ? (
                  <ApprovalIcon />
                ) : (
                  <HowToRegIcon></HowToRegIcon>
                )}
              </IconButton>
            </Tooltip>
          )}
          {edit && canEdit && !Boolean(sop?.pullRequest) && (
            <Tooltip title="Send for approval">
              <IconButton aria-label="share" onClick={handleCreatePR}>
                <VerifiedIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
