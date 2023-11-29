import React, { useCallback, useEffect, useState } from "react";
import { useReactFlow } from "reactflow";

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  setMenu,
  setOpenCreateStepModal,
  setOpenCreateStepTemplateModal,
  setOpenDeleteStepModal,
  // toggleEdit,
  ...props
}) {
  const { getNode, getNodes, addNodes, addEdges, setEdges, getEdges, fitView } =
    useReactFlow();
  const [nextStep, setNextStep] = useState({
    hasNextStep: true,
    hasTemplate: true,
    type: null,
  });

  const deleteNode = () => {
    setOpenDeleteStepModal(true);
    setMenu(null);

    //setNodes((nodes) => nodes.filter((node) => node.id !== id));
    // setEdges((edges) => edges.filter((edge) => edge.source !== id));
  };

  const addNextStep = () => {
    setOpenCreateStepModal(true);
    setMenu(null);
  };

  const addTemplate = () => {
    // toggleEdit(true);
    setOpenCreateStepTemplateModal(true);
    setMenu(null);
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
        if (targetNode) {
          stepData.hasNextStep = true;
        }
      });
      setNextStep(stepData);
    }
  }, [id]);

  return (
    <div style={{ top, left }} className="context-menu" {...props}>
      <p style={{ margin: "0.5em" }}>
        <small>node: {id}</small>
      </p>

      {nextStep.type === "step" && (
        <button onClick={addNextStep}>Next Step</button>
      )}
      {nextStep.type === "step" && (
        <button onClick={addTemplate}>Manage Template</button>
      )}

      <button onClick={() => {}}>edit</button>
      <button onClick={deleteNode}>delete</button>
    </div>
  );
}
