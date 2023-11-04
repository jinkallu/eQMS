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
} from "@mui/material";

import { useExtnStore } from "../../../../zustand/store";

export default function CreateStepModal({
  open,
  setOpen,
  currentNode,
  setEdges,
  setNodes,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  currentNode: any;
  setNodes: (val: any) => void;
  setEdges: (val: any) => void;
}) {
  const { userSOPs, setAlertMessage, getFileContent, repository } =
    useExtnStore((state) => state);
  const [stepName, setStepName] = React.useState("");
  const [stepType, setStepType] = React.useState("step");
  const [template, setTemplate] = React.useState<{
    branchId: string;
    name: string;
    relativePath: string;
  }>({ branchId: null, name: null, relativePath: null });

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
    console.log(template);
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
          console.log(html, inputNodes);
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

    const position = {
      x: currentNode.node.position.x,
      y: currentNode.node.position.y + 200,
    };

    const data = {
      label: stepName,
      type: "step",
    };

    //const parentExtent = getNode("A").extent;

    const newNode = {
      ...currentNode.node,
      id: `${stepName}-step`,
      position: position,
      data: data,
      //parentNode: "A",
      //extent: 'parent'
    };

    // setMyNodes(myNewNodes);

    setNodes((nodes) => {
      const newPositionedNodes = nodes?.map((node) => {
        if (node?.position?.y > currentNode.node.position.y) {
          return {
            ...node,
            position: { ...node.position, y: node.position.y + 200 },
          };
        }
        return node;
      });
      return [...newPositionedNodes, newNode];
    });

    const newEdge = {
      id: currentNode.node.id + "_" + newNode.id,
      source: currentNode.node.id,
      target: newNode.id,
      sourceHandle: "source_bottom",
      targetHandle: "target",
    };

    setEdges((edges) => {
      return [...edges, newEdge];
    });
  };

  function handleStepTypeChange(e) {
    setStepType(e.target.value);
  }
  function handleChange(e) {
    setTemplate(e.target.value);
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Step</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
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
              <option value="decision"> Decision</option>
            </Select>
          </FormControl>

          {stepType === "decision" && (
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="grouped-select">Select Template</InputLabel>
              <Select
                native
                id="grouped-s"
                value={template}
                onChange={handleChange}
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
          )}
        </Box>

        <DialogContentText>
          Please enter a name for the step...
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="message"
          label="Message"
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
