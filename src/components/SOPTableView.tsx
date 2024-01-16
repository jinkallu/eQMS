import React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import VerifiedIcon from "@mui/icons-material/Verified";
import PreviewIcon from "@mui/icons-material/Preview";
import EditIcon from "@mui/icons-material/Edit";

import ApprovalIcon from "@mui/icons-material/Approval";
import AddIcon from "@mui/icons-material/Add";
import { useExtnStore } from "../zustand/store";
import useSOPActions from "../CHooks/useSOPActions";
import TemplateCRUD from "./TemplateCRUD";
import CreatePRModal from "./CreatePRModal";
import ApprovalModal from "./ApprovalModal";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { getClient } from "azure-devops-extension-api";
import {
  FileDiffParams,
  FileDiffsCriteria,
  GitBaseVersionDescriptor,
  GitRestClient,
  GitTargetVersionDescriptor,
  GitVersionOptions,
  GitVersionType,
} from "azure-devops-extension-api/Git";

function Row({ sop, edit, expandAll }) {
  const [open, setOpen] = React.useState(false);
  const { branchTypes } = useExtnStore();
  const { currentUser, teamsWithMembers, project, repository } = useExtnStore();
  const {
    getActions,
    canEdit,
    myApprovalPending,
    myReviewPending,
    pullRequestStatus,
  } = useSOPActions();
  const [openAddTemplateModal, setOpenAddTemplateModal] = React.useState(false);
  const [openApprovalModal, setOpenApprovalModal] = React.useState(false);
  const [openCreatePRModal, setOpenCreatePRModal] = React.useState(false);
  const [isEditContentDifferentFromMain, setIsEditContentDifferentFromMain] =
    React.useState(false);
  const navigate = useNavigate();
  const gitClient = getClient(GitRestClient);

  async function checkGitDiff() {
    const baseVersionDescriptor: GitBaseVersionDescriptor = {
      baseVersion: edit?.commit?.commitId,
      baseVersionOptions: GitVersionOptions.None,
      baseVersionType: GitVersionType.Commit,
      version: edit?.commit?.commitId,
      versionOptions: GitVersionOptions.None,
      versionType: GitVersionType.Commit,
    };
    const targetVersionDescriptor: GitTargetVersionDescriptor = {
      targetVersion: sop?.commit?.commitId,
      targetVersionOptions: GitVersionOptions.None,
      targetVersionType: GitVersionType.Commit,
      version: sop?.commit?.commitId,
      versionOptions: GitVersionOptions.None,
      versionType: GitVersionType.Commit,
    };

    const res1 = await gitClient.getCommitDiffs(
      repository?.id,
      null,
      null,
      null,
      null,
      baseVersionDescriptor,
      targetVersionDescriptor
    );

    if (res1?.baseCommit !== res1?.commonCommit) {
      setIsEditContentDifferentFromMain(true);
    } else {
      setIsEditContentDifferentFromMain(false);
    }
  }

  React.useEffect(() => {
    if (sop && edit && project && repository) {
      checkGitDiff();
    }
  }, [edit, sop, project, repository]);

  React.useEffect(() => {
    if (currentUser && teamsWithMembers && sop && project && repository)
      getActions({
        sop,
        teamsWithMembers,
        currentUser,
        projectId: project?.id,
        repositoryId: repository?.id,
      });
  }, [currentUser, teamsWithMembers, sop, project, repository]);
  React.useEffect(() => {
    setOpen(expandAll);
  }, [expandAll]);
  function handleCreatePR() {
    setOpenCreatePRModal(true);
  }
  async function handleItemClick(item) {
    navigate({
      pathname: "/qmshub.html/content/",
      search: `?${createSearchParams({
        relativePath: item?.relativePath,
        type: item?.type,
        branchName: item?.name,
        canEdit: canEdit ? "yes" : "no",
      })}`,
    });
  }
  function handleAddTemplateClick() {
    setOpenAddTemplateModal(true);
  }

  return (
    <React.Fragment>
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
        canVote={myApprovalPending}
        pullRequestStatus={pullRequestStatus}
      ></ApprovalModal>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row">
          <Avatar aria-label="recipe" sx={{ backgroundColor: "#082567" }}>
            <Typography sx={{ fontSize: "12px" }}>{sop?.number}</Typography>
          </Avatar>
        </TableCell>
        <TableCell align="left">
          {sop?.relativePath.split("_").slice(1).join(" ")}
        </TableCell>

        <TableCell>
          {sop?.templates?.length}
          {sop?.templates?.length > 0 && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>
          <Tooltip title="View SOP">
            <IconButton aria-label="share" onClick={() => handleItemClick(sop)}>
              <PreviewIcon color="primary" />
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell>
          {sop?.author?.length > 0 && (
            <Tooltip title="Add Template">
              <IconButton aria-label="share" onClick={handleAddTemplateClick}>
                <AddIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
        {/* <TableCell>
          {sop?.author?.length > 0 && (
            <Tooltip title="Edit SOP">
              <IconButton aria-label="share" onClick={() => {}}>
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell> */}
        <TableCell>
          {edit &&
            isEditContentDifferentFromMain &&
            canEdit &&
            !Boolean(sop?.pullRequest) && (
              <Tooltip title="Send for approval">
                <IconButton aria-label="share" onClick={handleCreatePR}>
                  <VerifiedIcon color="primary" />
                </IconButton>
              </Tooltip>
            )}
        </TableCell>

        <TableCell>
          {sop?.pullRequest && myReviewPending && (
            <Tooltip title="Review">
              <IconButton
                aria-label="review"
                onClick={() => setOpenApprovalModal(true)}
              >
                <RateReviewIcon color="primary" sx={{ cursor: "pointer" }} />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>

        <TableCell>
          {sop?.pullRequest && myApprovalPending && (
            <Tooltip title="Approve">
              <IconButton
                aria-label="approva"
                onClick={() => setOpenApprovalModal(true)}
              >
                <ApprovalIcon color="primary" sx={{ cursor: "pointer" }} />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse
            in={open && sop?.templates?.length > 0}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Templates
              </Typography>
              <Table size="small" aria-label="templates">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>View Template</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sop?.templates
                    ?.slice()
                    .sort((a, b) =>
                      a?.relativePath.localeCompare(b?.relativePath)
                    )
                    .map((template) => {
                      return (
                        <TableRow key={template?.branchId}>
                          <TableCell component="th" scope="row">
                            {template?.relativePath.replace(/_/g, " ")}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Template">
                              <IconButton
                                aria-label="share"
                                onClick={() => handleItemClick(template)}
                              >
                                <PreviewIcon color="primary" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function SOPTableView({ userSOPs }) {
  const { branchFileNames, branches } = useExtnStore();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [expandAll, setExpandAll] = React.useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Box sx={{ width: "100%", paddingX: "32px" }}>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e3dfde" }}>
              <TableCell>Number</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell>
                <FormControlLabel
                  control={
                    <Switch
                      checked={expandAll}
                      onChange={() => setExpandAll((prev) => !prev)}
                    />
                  }
                  label="Templates"
                />
              </TableCell>
              <TableCell>View SOP</TableCell>
              <TableCell>Add Template</TableCell>
              {/* <TableCell>Edit</TableCell> */}
              <TableCell>Send for Approval</TableCell>
              <TableCell>Review</TableCell>
              <TableCell>Approve</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userSOPs
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.sort((sop) => sop?.sortOrder)
              ?.map((sop) => {
                const edit = branches?.find(
                  (item) =>
                    item.name ===
                    `qms/sop/${sop.branchId}/${sop.relativePath}/edit`
                );

                //
                return (
                  <Row
                    key={sop.branchId}
                    sop={sop}
                    // branch={branch}
                    edit={edit}
                    expandAll={expandAll}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={userSOPs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
