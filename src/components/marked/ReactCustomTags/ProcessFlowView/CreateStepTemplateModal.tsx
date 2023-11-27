import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  ListSubheader,
  MenuItem,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useExtnStore } from "../../../../zustand/store";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CreateStepTemplateModal({
  open,
  setOpen,
  currentNode,
  state,
  handleChange,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  currentNode: any;
  state: any;
  handleChange: any;
}) {
  const { getFileContent, repository, project, userSOPs } = useExtnStore(
    (state) => state
  );

  const [editMode, setEditMode] = React.useState(false);
  const [template, setTemplate] = React.useState<string>();
  const [nodesTemp, setNodesTemp] = React.useState([]);

  React.useEffect(() => {
    if (state && state["processFlow"]) {
      setNodesTemp(state["processFlow"]?.nodes || []);
    }
  }, [state]);

  async function handleCreate() {
    addTemplate();
    setNodesTemp(state["processFlow"]?.nodes);

    setOpen(false);
  }

  function handleClose() {
    setNodesTemp(state["processFlow"]?.nodes);

    setOpen(false);
  }

  const addTemplate = () => {
    handleChange("processFlow", {
      nodes: nodesTemp,
      edges: state["processFlow"]?.edges,
    });
  };

  async function handleEditMode(node) {
    let groupingData;
    if (node?.data?.templateId) {
      groupingData = await getTemplateData(node?.data?.templateId);
    }
    const newNodes = nodesTemp?.map((item) => {
      if (item.data.label === node.data.label) {
        return { ...item, editMode: true, groupingData };
      } else {
        if (item?.data?.templateId === node?.data?.templateId) {
          return { ...item, editMode: false, groupingData };
        }
        return { ...item, editMode: false };
      }
    });

    setNodesTemp(newNodes);
  }

  function handleReset() {
    setNodesTemp(state["processFlow"]?.nodes);
  }

  async function handleChangeData(e, node) {
    let groupingData;
    if (node?.data?.templateId) {
      groupingData = await getTemplateData(e.target.value);
    }
    let templateName;
    userSOPs?.map((sop) => {
      const tempData = sop?.templates?.find(
        (temp) => temp.branchId === e.target.value
      );
      if (tempData) {
        templateName = tempData.relativePath;
      }
    });
    const newNodes = nodesTemp?.map((item) => {
      if (item.data.label === node.data.label) {
        return {
          ...item,
          groupingData,
          data: {
            ...item.data,
            templateId: e.target.value,
            templateName: templateName,
          },
        };
      }
      return item;
    });

    setNodesTemp(newNodes);
    // handleChange("processFlow", {
    //   nodes: newNodes,
    //   edges: state["processFlow"]?.edges,
    // });
    // setTemplate(e.target.value);
  }

  async function getTemplateData(templateId) {
    let templateFull;

    userSOPs?.map((sop) => {
      const templateNameData = sop?.templates?.find(
        (item) => item.branchId === templateId
      );
      if (templateNameData) {
        templateFull = templateNameData;
      }

      return sop;
    });

    if (templateFull) {
      const data = await getFileContent(
        repository.id,
        "qms/temp/data.html",
        templateFull.name
      );
      if (data) {
        const parser = new DOMParser();
        const html = parser.parseFromString(data, "text/html");
        const groupingData = html.getElementsByTagName("GROUPING");
        if (groupingData) {
          const groupingMatrix = Array.from(groupingData)?.map(
            (item, index) => {
              const id = item.getAttribute("id");
              const name = item.getAttribute("name");
              return { id, name, order: index };
            }
          );
          return groupingMatrix;
        }
      }

      return;
    }
  }

  // async function createTemplateGroupingMatrix() {
  //   const groupingEls = await getTemplateData();
  //   if (!groupingEls) {
  //     return [];
  //   }
  //   const groupingMatrix = Array.from(groupingEls)?.map((item, index) => {
  //     const id = item.getAttribute("id");
  //     const name = item.getAttribute("name");
  //     return { id, name, order: index };
  //   });
  // }

  function handleGroupChange(e, node) {
    const {
      target: { value },
    } = e;
    const val =
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value;

    const newNodes = nodesTemp?.map((item) => {
      if (item.data.label === node.data.label) {
        return { ...item, data: { ...item.data, grouping: val } };
      } else {
        return item;
      }
    });

    setNodesTemp(newNodes);
  }
  // useEffect(() => {
  //   if (
  //     open &&
  //     userSOPs?.length > 0 &&
  //     state &&
  //     state["processFlow"]?.nodes?.length >= 0
  //   ) {
  //     const nodes = state["processFlow"]?.nodes;
  //     const newUserSops = userSOPs?.map((sop) => {
  //       const templates = sop?.templates?.map((temp) => {
  //         const steps =
  //           nodes?.filter((node) => node?.data?.templateId === temp.branchId) ||
  //           [];
  //         return { ...temp, steps };
  //       });
  //       return { ...sop, templates };
  //     });
  //     console.log(newUserSops);
  //   }
  // }, [userSOPs, state, open]);

  // useEffect(() => {
  //   createTemplateGroupingMatrix();
  // }, []);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "800px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>Template Management</DialogTitle>
      <DialogContent>
        <DialogContentText>Edit / Add Templates</DialogContentText>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="Step Templates">
            <TableHead>
              <TableRow>
                <TableCell>Step Name</TableCell>
                <TableCell align="center">Template Name</TableCell>
                <TableCell align="center">Grouping</TableCell>
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nodesTemp
                ?.filter((node) => node?.type === "step")
                ?.map((node) => (
                  <TableRow
                    key={node.data.label}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{node?.data?.label}</TableCell>
                    <TableCell align="left">
                      <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel htmlFor="grouped-select">
                          Select Template
                        </InputLabel>
                        <Select
                          native
                          disabled={!node?.editMode}
                          defaultValue={node?.data?.templateId}
                          id="grouped-s"
                          value={node.templateId}
                          onChange={(e) => handleChangeData(e, node)}
                        >
                          <option aria-label="None" value="" />
                          {userSOPs
                            ?.filter((item) => item.templates?.length > 0)
                            ?.map((sop) => (
                              <optgroup
                                key={sop.relativePath}
                                label={sop?.relativePath}
                              >
                                {sop?.templates?.map((temp) => (
                                  <option
                                    key={temp.branchId}
                                    value={temp.branchId}
                                  >
                                    {temp?.relativePath}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="left">
                      {node?.editMode ? (
                        <FormControl sx={{ m: 1, width: 300 }}>
                          <InputLabel id="demo-multiple-chip-label">
                            Grouping
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={node.data.grouping || []}
                            onChange={(e) => handleGroupChange(e, node)}
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                label="Grouping"
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {/* <MenuItem key={"all"} value={"all"}>
                              <Checkbox checked={true} />
                              <ListItemText primary={"All"} />
                            </MenuItem> */}
                            {node?.groupingData?.map((gpdata) => (
                              <MenuItem key={gpdata.name} value={gpdata.name}>
                                <Checkbox
                                  checked={
                                    node?.data?.grouping?.indexOf(gpdata.name) >
                                    -1
                                  }
                                />
                                <ListItemText primary={gpdata.name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Box>
                          {node?.data?.grouping?.map((item) => (
                            <Chip key={item} label={item}></Chip>
                          ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="left">
                      <IconButton onClick={() => handleEditMode(node)}>
                        <EditIcon></EditIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
