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
import Chip from "@mui/material/Chip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import VerifiedIcon from "@mui/icons-material/Verified";
import PreviewIcon from "@mui/icons-material/Preview";
import EditIcon from "@mui/icons-material/Edit";

import ApprovalIcon from "@mui/icons-material/Approval";
import { useExtnStore } from "../zustand/store";
import useSOPActions from "../CHooks/useSOPActions";
import TemplateCRUD from "./TemplateCRUD";
import CreatePRModal from "./CreatePRModal";
import ApprovalModal from "./ApprovalModal";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";

function Row({ sop, branch, edit }) {
  const [open, setOpen] = React.useState(false);
  const { branchFileNames } = useExtnStore();
  const { currentUser, teamsWithMembers } = useExtnStore();
  const { getActions, canEdit, myApprovalPending } = useSOPActions();
  const [openAddTemplateModal, setOpenAddTemplateModal] = React.useState(false);
  const [openApprovalModal, setOpenApprovalModal] = React.useState(false);
  const [openCreatePRModal, setOpenCreatePRModal] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    getActions({ sop, teamsWithMembers, currentUser });
  }, [currentUser, teamsWithMembers, sop]);

  function handleCreatePR() {
    setOpenCreatePRModal(true);
  }
  async function handleItemClick(branch) {
    navigate({
      pathname: "/qmshub.html/content/",
      search: `?${createSearchParams({
        objectId: branch?.objectId,
        relativePath: branch?.relativePath,
        type: branch?.type,
        branchName: branch?.name,
        canEdit: canEdit ? "yes" : "no",
      })}`,
    });
  }

  return (
    <React.Fragment>
      <TemplateCRUD
        open={openAddTemplateModal}
        setOpen={setOpenAddTemplateModal}
        branchId={branch?.branchId}
        sopName={branch?.relativePath}
      ></TemplateCRUD>

      <CreatePRModal
        open={openCreatePRModal}
        setOpen={setOpenCreatePRModal}
        branchId={branch?.branchId}
        sopName={branch?.relativePath}
      ></CreatePRModal>

      <ApprovalModal
        open={openApprovalModal}
        setOpen={setOpenApprovalModal}
        pullRequest={sop?.pullRequest}
        branchId={branch?.branchId}
        sopName={branch?.relativePath}
        canVote={myApprovalPending}
      ></ApprovalModal>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row">
          <Avatar aria-label="recipe" sx={{ backgroundColor: "#082567" }}>
            <Typography sx={{ fontSize: "12px" }}>
              {branch?.relativePath?.split("-")[1]}
            </Typography>
          </Avatar>
        </TableCell>
        <TableCell align="left"> {branch?.relativePath}</TableCell>

        <TableCell>
          {sop?.templates?.length}
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Tooltip title="View SOP">
            <IconButton
              aria-label="share"
              onClick={() => handleItemClick(branch)}
            >
              <PreviewIcon color="primary" />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell>
          {sop?.author?.length > 0 && (
            <Tooltip title="Edit SOP">
              <IconButton aria-label="share" onClick={() => {}}>
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
        <TableCell>
          {edit && canEdit && !Boolean(sop?.pullRequest) && (
            <Tooltip title="Send for approval">
              <IconButton aria-label="share" onClick={handleCreatePR}>
                <VerifiedIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
        <TableCell>
          {sop?.pullRequest && (
            <Tooltip title="Approve">
              {myApprovalPending ? (
                <IconButton
                  aria-label="approva"
                  onClick={() => setOpenApprovalModal(true)}
                >
                  <ApprovalIcon color="primary" sx={{ cursor: "pointer" }} />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="approva"
                  onClick={() => setOpenApprovalModal(true)}
                >
                  <HowToRegIcon color="primary"></HowToRegIcon>
                </IconButton>
              )}
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Templates
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sop?.templates?.map((template) => {
                    const tempBranch = branchFileNames.find(
                      (item) =>
                        item.type === "temp" && item.branchId === template
                    );
                    return (
                      <TableRow key={tempBranch?.relativePath}>
                        <TableCell component="th" scope="row">
                          {tempBranch?.relativePath}
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
            <TableRow>
              <TableCell>
                <Chip label="Number" color="primary"></Chip>
              </TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell>Templates</TableCell>
              <TableCell>View SOP</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Send for Approval</TableCell>
              <TableCell>Approve</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userSOPs
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.sort((sop) => sop?.sortOrder)
              ?.map((sop) => {
                const branch = branchFileNames?.find(
                  (item) =>
                    item.branchId === sop.branchId && item.type === "sop"
                );
                const edit = branches.find(
                  (item) => item.name === `qms/sop/${sop.branchId}/edit`
                );
                //
                return (
                  <Row
                    key={sop.branchId}
                    sop={sop}
                    branch={branch}
                    edit={edit}
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
