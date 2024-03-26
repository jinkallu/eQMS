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
  Switch,
  FormControlLabel,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { MarkerType } from "reactflow";

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
  tagName: string;
}

import { useExtnStore } from "../../../../zustand/store";

export default function CreateStepModal({
  open,
  setOpen,
  currentNode,
  nodes,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  currentNode: any;
  nodes: any;
}) {
  const {
    userSOPs,
    setAlertMessage,
    getFileContent,
    repository,
    templateState,
    setTemplateState,
  } = useExtnStore((state) => state);
  const [stepName, setStepName] = React.useState("");
  const [stepType, setStepType] = React.useState("step");
  const [isProductLevel, setIsProductLevel] = React.useState(false);
  const [nameError, setNameError] = React.useState({
    error: false,
    message: "",
  });

  const [inputNodes, setInputNodes] = React.useState(null);
  const [template, setTemplate] = React.useState<{
    branchId: string;
    name: string;
    relativePath: string;
  }>({ branchId: null, name: null, relativePath: null });

  const [conditions, setConditions] = React.useState<IConditions[]>([
    { operator: "=", value: "", id: 1, stepName: "" },
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
          // const inputNodes = html.getElementsByTagName("input");
          const inputNodes = html.querySelectorAll(
            "input, h1,h2,h3,h4,h5,h6,span"
          );
          setInputNodes(inputNodes);
        }
      }
    );
  }, [template]);

  const createStep = () => {
    const position =
      currentNode?.node?.type === "group"
        ? { x: (currentNode.node.width - 200) / 2, y: 100 }
        : {
            x: currentNode?.node?.position?.x || 200,
            y: currentNode?.node?.position?.y + 200 || 200,
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
        productLevel: isProductLevel,
      };
    } else if (stepType === "multidec") {
      data = {
        label: stepName,
        productLevel: isProductLevel,
        type: stepType,
        field: inputEl?.find((item) => item.selected)?.id, // TODO: get it from template field,
        conditions,
        refTemplateId: template,
        inputEl: inputEl?.find((item) => item?.selected),
      };
    }

    //const parentExtent = getNode("A").extent;

    const newNode = {
      // ...currentNode.node,
      id: `${stepName}-step`,
      position: position,
      data: data,
      type: stepType,
      // parentNode: "A",
      extent: "parent",
      height: 50,
      width: 150,
    };

    // setMyNodes(myNewNodes);

    // setNodes((nodes) => {
    let nodesNew = [];
    const newPositionedNodes = templateState["processFlow"]?.nodes?.map(
      (node) => {
        if (node?.position?.y > currentNode.node.position.y) {
          return {
            ...node,
            position: { ...node.position, y: node.position.y + 200 },
          };
        }
        return node;
      }
    );

    if (stepType === "multidec") {
      const newNodes = conditions
        ?.filter(
          (item) =>
            item?.stepName !==
            nodes?.find((node) => node?.data?.label === item.stepName)?.data
              ?.label
        )
        .map((cond, index) => {
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
    let edgesNew = templateState["processFlow"]?.edges || [];
    const newEdge = currentNode
      ? {
          id: currentNode.node.id + "_" + newNode.id,
          source: currentNode.node.id,
          target: newNode.id,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#FF0072",
          },
          sourceHandle: "source_bottom",
          targetHandle: "target",
        }
      : {};

    // setEdges((edges) => {
    if (stepType === "multidec") {
      const newEdges = conditions?.map((cond, index) => {
        const newEdge = {
          id: newNode.id + "_" + `${cond.stepName}-step`,
          source: newNode.id,
          target: `${cond.stepName}-step`,
          type: "smart",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#FF0072",
          },
          label: cond.value,
          sourceHandle: cond.value,
          targetHandle: "target",
        };
        return newEdge;
      });

      // edges = [...state["processFlow"]?.edges, newEdge, ...newEdges];
      edgesNew = [...edgesNew, newEdge, ...newEdges];
    } else {
      // edges = [...state["processFlow"]?.edges, newEdge];
      edgesNew = [...edgesNew, newEdge];
    }
    // if (currentNode?.node?.type === "group") {
    //   edgesNew = [...state["processFlow"]?.edges];
    // }
    // else{

    // }

    // });
    setTemplateState("processFlow", { nodes: nodesNew, edges: edgesNew });
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

  function handleStepNameChange(e) {
    setStepName(e.target.value);
    const stepWithSameName = templateState["processFlow"]?.nodes?.find(
      (item) => item?.data?.label === e.target.value
    );
    if (stepWithSameName) {
      setNameError({ error: true, message: "Step with same name exists.." });
    } else {
      setNameError({ error: false, message: "" });
    }
  }

  useEffect(() => {
    setIsProductLevel(false);
  }, [stepType]);
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
              value={stepType}
              onChange={handleStepTypeChange}
            >
              <option value="step"> Step</option>
              <option value="multidec"> Decision</option>
            </Select>
          </FormControl>

          {stepType === "step" && (
            <FormControlLabel
              control={
                <Switch
                  checked={isProductLevel}
                  onChange={(e) => setIsProductLevel(e.target.checked)}
                />
              }
              label="Product Level"
            />
          )}

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
            nodes={nodes}
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
          error={nameError?.error}
          helperText={nameError?.message}
          variant="standard"
          value={stepName}
          onChange={handleStepNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={!stepName || nameError?.error} onClick={handleCreate}>
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
  nodes,
}: {
  inputs: NodeListOf<Element>;
  conditions: IConditions[];
  setConditions: (val: IConditions[]) => void;
  inputEl: IInputEl[];
  setInputEl: (val: IInputEl[]) => void;
  nodes: any;
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
      Array.from(inputs)
        ?.filter((item) => item.getAttribute("id") !== null || undefined)
        ?.map((inp) => {
          const id = inp.getAttribute("id");
          const name = inp.getAttribute("name");
          const tagName = inp.tagName;

          return { id, name, selected: false, tagName };
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
      stepName: "",
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

  function handleChangeStepName(id, name) {
    const newConditions = conditions?.map((item) => {
      if (item.id === id) {
        return { ...item, stepName: name };
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
              {inp?.tagName}
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
                  {/* <Input
                    size="small"
                    value={cond.stepName}
                    onChange={(e) => handleChangeStepName(cond.id, e)}
                  ></Input> */}

                  <StepSelector
                    handleChangeStepName={handleChangeStepName}
                    cond={cond}
                    nodes={nodes}
                  ></StepSelector>
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

const StepSelector = ({ handleChangeStepName, cond, nodes }) => {
  const [isNewStep, setIsNewStep] = React.useState(true);
  const [node, setNode] = React.useState(null);
  const [error, setError] = React.useState("");
  function handleChangeVal(e) {
    const node = nodes?.find((item) => item?.id === e.target.value);
    setNode(node);
    handleChangeStepName(cond?.id, node?.data?.label);
  }

  function handleStepNameChange(id, name) {
    setError("");
    const node = nodes?.find((item) => item?.data?.label === name);
    if (node) {
      setError("Node name already exists");
    }

    handleChangeStepName(id, name);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={isNewStep}
            onChange={() => setIsNewStep((prev) => !prev)}
          />
        }
        label={isNewStep ? "New Step" : "Existing Step"}
      />

      {isNewStep ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Input
            size="small"
            value={cond.stepName}
            onChange={(e) => handleStepNameChange(cond.id, e?.target.value)}
          ></Input>
          {error && <span style={{ color: "red" }}>{error}</span>}
        </Box>
      ) : (
        <FormControl
          sx={{
            m: 1,
          }}
        >
          <InputLabel htmlFor="grouped-select">Select Step</InputLabel>
          <Select
            native
            id="grouped-s"
            value={node?.id}
            onChange={handleChangeVal}
          >
            <option aria-label="None" value="" />
            {nodes
              ?.filter((item) => item.type === "step")
              ?.map((item) => (
                <option key={item?.data?.label} value={item?.id}>
                  {item?.data?.label}
                </option>
              ))}
            ))
          </Select>
        </FormControl>
      )}
    </Box>
  );
};
