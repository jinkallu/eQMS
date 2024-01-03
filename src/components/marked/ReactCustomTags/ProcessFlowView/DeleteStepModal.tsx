import React, { useEffect } from "react";
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

export default function DeleteStepModal({
  open,
  setOpen,
  currentNode,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  currentNode: any;
}) {
  const { templateState, setTemplateState, setAlertMessage } = useExtnStore(
    (state) => state
  );
  const [stepName, setStepName] = React.useState("");

  async function handleDelete() {
    deleteStep();
    setOpen(false);
  }

  function handleClose() {
    setOpen(false);
  }

  const deleteStep = () => {
    console.log(currentNode);
    // 1. delete current step

    // 2. Decrease position.y of all steps greater than current by 200

    let templateNodeId = currentNode.node.id;

    templateState["processFlow"]?.edges
      .filter((item) => item.source === currentNode.node.id)
      ?.map((edge) => {
        const templateNode = templateState["processFlow"]?.nodes?.find(
          (node) => node.id === edge.target && node.data.type === "template"
        );
        if (templateNode) {
          templateNodeId = templateNode.id;
        }
      });

    // setNodes((nodes) => {
    const newPositionedNodes = templateState["processFlow"]?.nodes
      ?.filter(
        (node) => node.id !== currentNode.node.id && node.id !== templateNodeId
      )
      ?.map((node) => {
        if (
          node?.position?.y > currentNode.node.position.y &&
          currentNode.node.data.type === "step"
        ) {
          return {
            ...node,
            position: { ...node.position, y: node.position.y - 200 },
          };
        }
        return node;
      });
    // });

    // 3. Get all edges with current node as source or target, remove all edges with current node as target and  and change the source of the edges with source as current node to prev one

    const targetEdge = templateState["processFlow"]?.edges.find(
      (edge) => edge.target === currentNode.node.id
    );
    let newEdges = templateState["processFlow"]?.edges;
    if (targetEdge) {
      // setEdges((edges) => {
      newEdges = templateState["processFlow"]?.edges?.filter(
        (edge) => edge.id !== targetEdge.id && edge.target !== templateNodeId
      );
      newEdges = newEdges?.map((edge) => {
        if (edge.source === currentNode.node.id) {
          return { ...edge, source: targetEdge.source };
        } else {
          return edge;
        }
      });
      // });
    }

    setTemplateState("processFlow", {
      nodes: newPositionedNodes,
      edges: newEdges,
    });

    // const newEdge = {
    //   id: currentNode.node.id + "_" + newNode.id,
    //   source: currentNode.node.id,
    //   target: newNode.id,
    //   sourceHandle: "source_bottom",
    //   targetHandle: "target",
    // };

    // setEdges((edges) => {
    //   return [...edges, newEdge];
    // });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete step</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action will delete the step and any associated templates.Are you
          sure to delet the step..?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
