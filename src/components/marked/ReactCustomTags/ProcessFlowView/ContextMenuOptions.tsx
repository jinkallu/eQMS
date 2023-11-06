import React, { useCallback, useEffect, useState } from "react";
import { useReactFlow } from "reactflow";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function ContextMenuOptions({
  id,
  anchorEl,
  handleMenuClose,
  myNodes,
  setMyNodes,
  myEdges,
  setMyEdges,
  setOpenCreateStepModal,
  setOpenCreateStepTemplateModal,
  setOpenDeleteStepModal,
  ...props
}) {
  const { getNode, getNodes, addNodes, addEdges, setEdges, getEdges, fitView } =
    useReactFlow();
  const isMenuOpen = Boolean(anchorEl);

  const [nextStep, setNextStep] = useState({
    hasNextStep: true,
    hasTemplate: true,
    type: null,
  });

  const deleteNode = () => {
    handleMenuClose();
    setOpenDeleteStepModal(true);

    //setNodes((nodes) => nodes.filter((node) => node.id !== id));
    // setEdges((edges) => edges.filter((edge) => edge.source !== id));
  };

  const addNextStep = () => {
    handleMenuClose();
    setOpenCreateStepModal(true);
  };

  const addTemplate = () => {
    handleMenuClose();
    setOpenCreateStepTemplateModal(true);
  };
  useEffect(() => {
    const node = getNode(id);
    if (node && node?.data?.type === "step") {
      const edges = getEdges();
      const connectedChildren = edges.filter((edge) => edge.source == id);
      const stepData = {
        hasNextStep: false,
        hasTemplate: Boolean(node?.data?.templateName),
        type: "step",
      };
      connectedChildren.forEach((child) => {
        const targetNode = getNode(child.target);
        // if (targetNode.data.type === "step") {
        if (targetNode) {
          stepData.hasNextStep = true;
        }
        // } else if (targetNode.data.type === "template") {
        //   stepData.hasTemplate = true;
        // }
      });
      setNextStep(stepData);
    }
    //console.log(stepData);
  }, [id]);

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={"11"}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <p style={{ margin: "0.5em" }}>
        <small>node: {id}</small>
      </p>

      {nextStep.type === "step" && (
        <MenuItem onClick={addNextStep}>Next Step</MenuItem>
      )}
      {!nextStep.hasTemplate && nextStep.type === "step" && (
        <MenuItem onClick={addTemplate}>Add Template</MenuItem>
      )}

      <MenuItem onClick={handleMenuClose}>edit</MenuItem>
      <MenuItem onClick={deleteNode}>delete</MenuItem>
    </Menu>
  );
}
