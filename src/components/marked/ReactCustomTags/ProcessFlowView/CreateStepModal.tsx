import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
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
  const setAlertMessage = useExtnStore((state) => state.setAlertMessage);
  const [stepName, setStepName] = React.useState("");

  async function handleCreate() {
    createStep();
    setOpen(false);
  }

  function handleClose() {
    setOpen(false);
  }

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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Step</DialogTitle>
      <DialogContent>
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
