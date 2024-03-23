import React from "react";
import Box from "@mui/material/Box";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { useExtnStore } from "../zustand/store";

import SOPTableViewRow from "./SOPTableViewRow";

export default function SOPTableView({ userSOPs }) {
  console.log(userSOPs);
  const { branches } = useExtnStore();
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
                  <SOPTableViewRow
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
