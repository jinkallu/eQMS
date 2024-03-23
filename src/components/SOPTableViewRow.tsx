import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import VerifiedIcon from "@mui/icons-material/Verified";
import PreviewIcon from "@mui/icons-material/Preview";

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
  GitBaseVersionDescriptor,
  GitRestClient,
  GitTargetVersionDescriptor,
  GitVersionOptions,
  GitVersionType,
} from "azure-devops-extension-api/Git";

export default function SOPTableViewRow({ sop, edit, expandAll }) {
  const [open, setOpen] = useState(false);
  const { currentUser, teamsWithMembers, project, repository, branches } =
    useExtnStore();
  const {
    getActions,
    canEdit,
    myApprovalPending,
    myReviewPending,
    pullRequestStatus,
  } = useSOPActions();
  const [openAddTemplateModal, setOpenAddTemplateModal] = useState(false);
  const [openApprovalModal, setOpenApprovalModal] = useState(false);
  const [openCreatePRModal, setOpenCreatePRModal] = useState(false);
  const [isEditContentDifferentFromMain, setIsEditContentDifferentFromMain] =
    useState(false);
  const navigate = useNavigate();
  const gitClient = getClient(GitRestClient);

  async function gitDiff() {
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

    const fileDiffsCriteria = {
      baseVersionCommit: edit?.commit?.commitId,
      targetVersionCommit: sop?.commit?.commitId,
      fileDiffParams: [
        {
          originalPath: "qms/sop/data.html",
          path: "qms/sop/data.html",
        },
      ],
    };
    const res1 = await gitClient.getFileDiffs(
      fileDiffsCriteria,
      project?.id,
      repository?.id
    );
  }

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

  useEffect(() => {
    if (sop && edit && project && repository) {
      gitDiff();
      checkGitDiff();
    }
  }, [edit, sop, project, repository]);

  async function callGetActions(
    sop,
    teamsWithMembers,
    currentUser,
    projectId,
    repositoryId
  ) {
    await getActions({
      sop,
      teamsWithMembers,
      currentUser,
      projectId,
      repositoryId,
    });
  }
  useEffect(() => {
    if (currentUser && teamsWithMembers && sop && project && repository)
      callGetActions(
        sop,
        teamsWithMembers,
        currentUser,
        project?.id,
        repository?.id
      );
  }, [currentUser, teamsWithMembers, sop, project, repository]);
  useEffect(() => {
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
    <>
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
        myApprovalPending={myApprovalPending}
        myReviewPending={myReviewPending}
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
          <Tooltip title="Edit Version exists or not ">
            <span> {edit ? "Yes" : "No"}</span>
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
          {sop?.pullRequest && myReviewPending?.hasPrivilege && (
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
          {sop?.pullRequest && myApprovalPending?.hasPrivilege && (
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
                    <TableCell>Edit Version</TableCell>
                    <TableCell>Send for Approval</TableCell>
                    <TableCell>Review</TableCell>
                    <TableCell>Approve</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sop?.templates
                    ?.slice()
                    .sort((a, b) =>
                      a?.relativePath.localeCompare(b?.relativePath)
                    )
                    .map((template) => {
                      const edit = branches?.find(
                        (item) =>
                          item.name ===
                          `qms/temp/${sop.branchId}/${template.branchId}/${template.relativePath}/edit`
                      );

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
                          <TableCell>
                            <Tooltip title="Edit Version exists or not">
                              <span>{edit ? "Yes" : "No"}</span>
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
    </>
  );
}
