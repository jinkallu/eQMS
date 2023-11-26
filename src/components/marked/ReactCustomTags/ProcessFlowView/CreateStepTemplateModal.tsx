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
} from "@mui/material";

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
  const [template, setTemplate] = React.useState<string>();
  const [nodesTemp, setNodesTemp] = React.useState([]);

  React.useEffect(() => {
    if (state && state["processFlow"]) {
      setNodesTemp(state["processFlow"]?.nodes || []);
    }
  }, [state]);

  async function handleCreate() {
    addTemplate();
    setOpen(false);
  }

  function handleClose() {
    setOpen(false);
  }

  const addTemplate = () => {
    // const position = {
    //   x: currentNode.node.position.x + 200,
    //   y: currentNode.node.position.y,
    // };

    // let templateName;

    // userSOPs?.map((sop) => {
    //   const templateNameData = sop?.templates?.find(
    //     (item) => item.branchId === template
    //   )?.relativePath;
    //   if (templateNameData) {
    //     templateName = templateNameData;
    //   }
    //   return sop;
    // });

    // if (!templateName) {
    //   // show some error here
    //   return;
    // }

    // const data = {
    //   label: templateName,
    //   type: "template",
    // };

    // const newNode = {
    //   ...currentNode.node,
    //   id: `${template}-template`,
    //   position,
    //   data,
    //   type: "template",
    // };

    // const newNodes = state["processFlow"]?.nodes?.map((node) => {
    //   if (node.id === currentNode.node.id) {
    //     return {
    //       ...node,
    //       data: { ...node.data, templateName, templateId: template },
    //     };
    //   }
    //   return node;
    // });
    handleChange("processFlow", {
      nodes: nodesTemp,
      edges: state["processFlow"]?.edges,
    });

    // const newEdge = {
    //   id: currentNode.node.id + "_" + newNode.id,
    //   source: currentNode.node.id,
    //   target: newNode.id,
    //   sourceHandle: "source_right",
    //   targetHandle: "target",
    // };

    // setEdges((edges) => {
    //   return [...edges, newEdge];
    // });

    //fitView();
  };

  function handleReset() {
    setNodesTemp(state["processFlow"]?.nodes);
  }

  function handleChangeData(e, node) {
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

  async function getTemplateData() {
    let templateFull;

    userSOPs?.map((sop) => {
      const templateNameData = sop?.templates?.find(
        (item) => item.branchId === template
      );
      if (templateNameData) {
        templateFull = templateNameData;
      }

      return sop;
    });
    console.log(templateFull);

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
        return groupingData;
      }

      return;
    }
  }

  async function createTemplateGroupingMatrix() {
    const groupingEls = await getTemplateData();
    if (!groupingEls) {
      return [];
    }
    const groupingMatrix = Array.from(groupingEls)?.map((item, index) => {
      const id = item.getAttribute("id");
      const name = item.getAttribute("name");
      return { id, name, order: index };
    });
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

  useEffect(() => {
    createTemplateGroupingMatrix();
  }, [template]);
  return (
    <Dialog open={open} onClose={handleClose}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {nodesTemp
                ?.filter((node) => node.type === "step")
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
                      <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-chip-label">
                          Grouping
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          multiple
                          value={node.data.grouping || []}
                          onChange={handleChange}
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
                          <MenuItem key={"all"} value={"all"}>
                            <Checkbox checked={true} />
                            <ListItemText primary={"All"} />
                          </MenuItem>
                          {/* {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))} */}
                        </Select>
                      </FormControl>
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
