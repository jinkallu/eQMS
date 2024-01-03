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
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  currentNode: any;
}) {
  const {
    getFileContent,
    repository,
    userSOPs,
    templateState,
    setTemplateState,
  } = useExtnStore((state) => state);

  const [nodesTemp, setNodesTemp] = React.useState([]);

  React.useEffect(() => {
    if (templateState && templateState["processFlow"]) {
      setNodesTemp(templateState["processFlow"]?.nodes || []);
    }
  }, [templateState]);

  async function handleCreate() {
    addTemplate();
    setNodesTemp(templateState["processFlow"]?.nodes);

    setOpen(false);
  }

  function handleClose() {
    setNodesTemp(templateState["processFlow"]?.nodes);

    setOpen(false);
  }

  const addTemplate = () => {
    setTemplateState("processFlow", {
      nodes: nodesTemp,
      edges: templateState["processFlow"]?.edges,
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
    setNodesTemp(templateState["processFlow"]?.nodes);
  }

  function confictChecker(nodes) {
    const tempGpArray = {};

    const newNodesData = nodes?.map((node) => {
      console.log(node);
      if (!node?.groupingData || node?.groupingData?.length === 0) {
        if (tempGpArray[node?.data?.templateId]) {
          tempGpArray[node?.data?.templateId] =
            tempGpArray[node?.data?.templateId] + 1;
        } else {
          tempGpArray[node?.data?.templateId] = 1;
        }
      } else {
        node?.data?.grouping?.map((item) => {
          if (tempGpArray[node?.data?.templateId + item]) {
            tempGpArray[node?.data?.templateId + item] =
              tempGpArray[node?.data?.templateId + item] + 1;
          } else {
            tempGpArray[node?.data?.templateId + item] = 1;
          }
          return item;
        });
      }
    });
    const newArr = [];
    Object.keys(tempGpArray)?.map((key) => {
      if (tempGpArray[key] > 1) {
        newArr.push(key);
      }
    });

    const newNodes = nodes?.map((node) => {
      let errors;
      if (!node?.groupingData || node?.groupingData?.length === 0) {
        errors = newArr?.includes(node?.data?.templateId);
      } else {
        errors = newArr?.some((r) =>
          node?.data?.grouping
            ?.map((item) => node?.data?.templateId + item)
            ?.includes(r)
        );
      }

      return { ...node, errors };
    });
    return newNodes;
  }

  async function handleTemplateChange(e, node) {
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
    const newNodesData = nodesTemp?.map((item) => {
      if (item.data.label === node.data.label) {
        return {
          ...item,
          groupingData,
          data: {
            ...item.data,
            templateId: e.target.value,
            templateName: templateName,
            grouping:
              item?.data?.templateId === e.target.value
                ? item?.data?.grouping
                : [],
          },
        };
      }
      return item;
    });

    const newNodes = confictChecker(newNodesData);

    setNodesTemp(newNodes);
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

  const disableCreate =
    nodesTemp?.filter(
      (node) =>
        node?.errors ||
        (node?.groupingData?.length > 0 && node?.data.grouping?.length === 0)
    )?.length > 0;

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

    const newNodesData = confictChecker(newNodes);
    setNodesTemp(newNodesData);
  }

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
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell align="left">
                      <span style={{ color: node?.errors ? "red" : " black" }}>
                        {node?.data?.label}
                      </span>
                    </TableCell>
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
                          onChange={(e) => handleTemplateChange(e, node)}
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
        <Button disabled={disableCreate} onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
