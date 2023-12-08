import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Select,
  TextField,
  InputLabel,
  Box,
  Paper,
  Grid,
  Typography,
  Divider,
  Input,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

interface IConditions {
  operator: string;
  value: string;
  stepName: string;
  id: number;
}

interface IInputEl {
  id: string;
  name: string;
  selected: boolean;
}

import { useExtnStore } from "../../../../zustand/store";

export default function CreateStepModal({
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
  const { userSOPs, setAlertMessage, getFileContent, repository } =
    useExtnStore((state) => state);
  const [stepName, setStepName] = React.useState("");
  const [stepType, setStepType] = React.useState("step");
  const [inputNodes, setInputNodes] = React.useState<HTMLCollection>(null);
  const [template, setTemplate] = React.useState<{
    branchId: string;
    name: string;
    relativePath: string;
  }>({ branchId: null, name: null, relativePath: null });

  const [conditions, setConditions] = React.useState<IConditions[]>([
    { operator: "=", value: "", id: 1, stepName: "My step 1" },
  ]);

  const [inputEl, setInputEl] = React.useState<IInputEl[]>();
  async function handleCreate() {
    createStep();
    setOpen(false);
  }

  function handleClose() {
    setOpen(false);
  }

  useEffect(() => {
    if (!template) {
      return;
    }
    let temp;

    userSOPs?.map((sop) => {
      const templateNameData = sop?.templates?.find(
        (item) => item.branchId === template
      );
      if (templateNameData) {
        temp = templateNameData;
      }
      return sop;
    });
    if (!temp) {
      return;
    }

    getFileContent(repository.id, "qms/temp/data.html", temp.name).then(
      (data) => {
        if (data) {
          const parser = new DOMParser();
          const html = parser.parseFromString(data, "text/html");
          const inputNodes = html.getElementsByTagName("input");
          setInputNodes(inputNodes);
        }
      }
    );
  }, [template]);

  const createStep = () => {
    // const node = getNode(id);
    // if (node.data.type === "template") {
    //   setNextStep({ hasNextStep: true, hasTemplate: true });
    // } else if (node.data.type === "step") {
    //   const edges = getEdges();
    //   const connectedChildren = edges.filter((edge) => edge.source == id);
    //   const stepData = { hasNextStep: false, hasTemplate: false };
    //   connectedChildren.forEach((child) => {
    //     const targetNode = getNode(child.target);
    //     if (targetNode.data.type === "step") {
    //       stepData.hasNextStep = true;
    //     } else if (targetNode.data.type === "template") {
    //       stepData.hasTemplate = true;
    //     }
    //   });
    //   setNextStep(stepData);
    // }
    //console.log(stepName, stepType);

    const position =
      currentNode?.node?.type === "group"
        ? { x: 200, y: 100 }
        : {
            x: currentNode.node.position.x,
            y: currentNode.node.position.y + 200,
          };

    // let typ = stepType;
    // if(typ === "decision"){
    //   typ = "multidec";
    // }

    let data;
    if (stepType === "step") {
      data = {
        label: stepName,
        type: stepType,
      };
    } else if (stepType === "multidec") {
      data = {
        label: stepName,
        type: stepType,
        field: inputEl?.find((item) => item.selected)?.name, // TODO: get it from template field,
        conditions: conditions?.map((item) => item.value),
      };
    }

    //const parentExtent = getNode("A").extent;

    const newNode = {
      ...currentNode.node,
      id: `${stepName}-step`,
      position: position,
      data: data,
      type: stepType,
      parentNode: "A",
      extent: "parent",
    };

    console.log(state);

    // setMyNodes(myNewNodes);

    // setNodes((nodes) => {
    let nodesNew = [];
    const newPositionedNodes = state["processFlow"]?.nodes?.map((node) => {
      if (node?.position?.y > currentNode.node.position.y) {
        return {
          ...node,
          position: { ...node.position, y: node.position.y + 200 },
        };
      }
      return node;
    });

    if (stepType === "multidec") {
      const newNodes = conditions?.map((cond, index) => {
        const positionData = {
          x: position.x + 100 * (index + 1),
          y: position.y + 200,
        };

        data = {
          label: cond.stepName,
          type: "step",
        };
        const node = {
          ...newNode,
          id: `${cond.stepName}-step`,
          position: positionData,
          data: data,
          type: "step",
        };
        return node;
      });

      nodesNew = [...newPositionedNodes, newNode, ...newNodes];
    } else {
      nodesNew = [...newPositionedNodes, newNode];
    }
    // });
    let edgesNew = [];
    const newEdge = {
      id: currentNode.node.id + "_" + newNode.id,
      source: currentNode.node.id,
      target: newNode.id,
      sourceHandle: "source_bottom",
      targetHandle: "target",
    };

    // setEdges((edges) => {
    if (stepType === "multidec") {
      const newEdges = conditions?.map((cond, index) => {
        const newEdge = {
          id: newNode.id + "_" + `${cond.stepName}-step`,
          source: newNode.id,
          target: `${cond.stepName}-step`,
          sourceHandle: cond.value,
          targetHandle: "target",
        };
        return newEdge;
      });

      // edges = [...state["processFlow"]?.edges, newEdge, ...newEdges];
      edgesNew = [...state["processFlow"]?.edges, newEdge, ...newEdges];
    } else {
      // edges = [...state["processFlow"]?.edges, newEdge];
      edgesNew = [...state["processFlow"]?.edges, newEdge];
    }
    if (currentNode?.node?.type === "group") {
      edgesNew = [];
    }
    // });
    handleChange("processFlow", { nodes: nodesNew, edges: edgesNew });
  };

  function handleStepTypeChange(e) {
    let typ = e.target.value;
    //if(typ === "decision"){
    //  typ = "multidec";
    //}
    setStepType(typ);
  }
  function handleChangeVal(e) {
    setTemplate(e.target.value);
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Step</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px",
            margin: "9px",
          }}
        >
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel htmlFor="select">Select Step Type</InputLabel>
            <Select
              id="select"
              native
              defaultValue="step"
              value={stepType}
              onChange={handleStepTypeChange}
            >
              <option value="step"> Step</option>
              <option value="multidec"> Decision</option>
            </Select>
          </FormControl>

          <FormControl
            sx={{
              m: 1,
              minWidth: 120,
              visibility: stepType === "multidec" ? "visible" : "hidden",
            }}
          >
            <InputLabel htmlFor="grouped-select">Select Template</InputLabel>
            <Select
              native
              id="grouped-s"
              value={template}
              onChange={handleChangeVal}
            >
              <option aria-label="None" value="" />
              {userSOPs
                ?.filter((item) => item.templates?.length > 0)
                ?.map((sop) => (
                  <optgroup key={sop.relativePath} label={sop?.relativePath}>
                    {sop?.templates?.map((temp) => (
                      <option key={temp.branchId} value={temp.branchId}>
                        {temp?.relativePath}
                      </option>
                    ))}
                  </optgroup>
                ))}
            </Select>
          </FormControl>
        </Box>
        <Divider></Divider>

        {stepType === "multidec" && (
          <InputElements
            inputs={inputNodes}
            conditions={conditions}
            setConditions={setConditions}
            inputEl={inputEl}
            setInputEl={setInputEl}
          ></InputElements>
        )}

        <DialogContentText>
          Please enter a name for the step...
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="message"
          label="Step Name"
          fullWidth
          variant="standard"
          value={stepName}
          onChange={(e) => setStepName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={!stepName} onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const InputElements = ({
  inputs,
  conditions,
  setConditions,
  inputEl,
  setInputEl,
}: {
  inputs: HTMLCollection;
  conditions: IConditions[];
  setConditions: (val: IConditions[]) => void;
  inputEl: IInputEl[];
  setInputEl: (val: IInputEl[]) => void;
}) => {
  const operators = [
    {
      id: 1,
      operator: "===",
      val: "equal to",
    },
    { id: 2, operator: "!==", val: "Not equal to" },
  ];

  useEffect(() => {
    if (!inputs) {
      setInputEl([]);
      return;
    }
    const data =
      Array.from(inputs)?.map((inp) => {
        const id = inp.getAttribute("id");
        const name = inp.getAttribute("name");

        return { id, name, selected: false };
      }) || [];
    setInputEl(data);
  }, [inputs]);

  function handleClick(inp) {
    const newInputs = inputEl?.map((item) => {
      if (item.id === inp.id) {
        return { ...item, selected: true };
      } else {
        return { ...item, selected: false };
      }
    });
    setInputEl(newInputs);
  }

  function handleAddCondition() {
    const id = conditions?.length + 1;
    const newCondition: IConditions = {
      operator: "=",
      value: "",
      id,
      stepName: `My step ${id}`,
    };
    const newConditions = [...conditions, newCondition];
    setConditions(newConditions);
  }

  function handleRemoveCondition(id) {
    const newConditions = conditions?.filter((item) => item.id !== id);
    setConditions(newConditions);
  }

  function handleChangeValue(id, e) {
    const newConditions = conditions?.map((item) => {
      if (item.id === id) {
        return { ...item, value: e.target.value };
      } else return item;
    });

    setConditions(newConditions);
  }

  function handleChangeStepName(id, e) {
    const newConditions = conditions?.map((item) => {
      if (item.id === id) {
        return { ...item, stepName: e.target.value };
      } else return item;
    });
    setConditions(newConditions);
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginY: "24px",
        gap: "24px",
      }}
    >
      <Typography>Choose an input field</Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: "9px" }}>
        {inputEl?.map((inp) => {
          return (
            <Paper
              key={inp.id}
              onClick={() => handleClick(inp)}
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "11px",
                fontSize: "9px",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#dcdcdc" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  visibility: inp.selected ? "visible" : "hidden",
                }}
              >
                <CheckCircleOutlineIcon color="primary"></CheckCircleOutlineIcon>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <span>Id</span>
                </Grid>
                <Grid item xs={6}>
                  <span style={{ fontWeight: "600" }}>{inp.id}</span>
                </Grid>

                <Grid item xs={6}>
                  <span>name</span>
                </Grid>
                <Grid item xs={6}>
                  <span style={{ fontWeight: "600" }}>{inp.name}</span>
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", paddingY: "9px" }}>
        <Typography> Create Conditions</Typography>
        {inputEl?.filter((item) => item.selected)?.length > 0 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                Operator
              </Grid>
              <Grid item xs={3}>
                Value
              </Grid>
              <Grid item xs={3}>
                Step Name
              </Grid>
              <Grid item xs={4}>
                Actions
              </Grid>
            </Grid>
            {conditions?.map((cond, index) => (
              <Grid container spacing={2} key={cond.id}>
                <Grid item xs={2}>
                  {cond.operator}
                </Grid>
                <Grid item xs={3}>
                  <Input
                    size="small"
                    value={cond.value}
                    onChange={(e) => handleChangeValue(cond.id, e)}
                  ></Input>
                </Grid>

                <Grid item xs={3}>
                  <Input
                    size="small"
                    value={cond.stepName}
                    onChange={(e) => handleChangeStepName(cond.id, e)}
                  ></Input>
                </Grid>
                <Grid item xs={2}>
                  {index > 0 && (
                    <CloseIcon
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleRemoveCondition(cond.id)}
                    ></CloseIcon>
                  )}
                </Grid>

                <Grid item xs={2}>
                  {index === conditions.length - 1 && (
                    <AddIcon
                      sx={{ cursor: "pointer" }}
                      onClick={handleAddCondition}
                    ></AddIcon>
                  )}
                </Grid>
              </Grid>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
