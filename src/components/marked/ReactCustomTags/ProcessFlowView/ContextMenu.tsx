import React, { useCallback, useEffect, useState } from "react";
import { useReactFlow } from "reactflow";

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
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
  const [nextStep, setNextStep] = useState({
    hasNextStep: true,
    hasTemplate: true,
    type: null,
  });

  const deleteNode = () => {
    setOpenDeleteStepModal(true);

    //setNodes((nodes) => nodes.filter((node) => node.id !== id));
    // setEdges((edges) => edges.filter((edge) => edge.source !== id));
  };

  const addNextStep = () => {
    setOpenCreateStepModal(true);
  };

  const addTemplate = () => {
    setOpenCreateStepTemplateModal(true);
  };
  useEffect(() => {
    const node = getNode(id);
    if (node.data.type === "template") {
      setNextStep({ hasNextStep: true, hasTemplate: true, type: "template" });
    } else if (node.data.type === "step") {
      const edges = getEdges();
      const connectedChildren = edges.filter((edge) => edge.source == id);
      const stepData = { hasNextStep: false, hasTemplate: false, type: "step" };
      connectedChildren.forEach((child) => {
        const targetNode = getNode(child.target);
        if (targetNode.data.type === "step") {
          stepData.hasNextStep = true;
        } else if (targetNode.data.type === "template") {
          stepData.hasTemplate = true;
        }
      });
      setNextStep(stepData);
    }
    //console.log(stepData);
  }, [id]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <p style={{ margin: "0.5em" }}>
        <small>node: {id}</small>
      </p>

      {nextStep.type === "step" && (
        <button onClick={addNextStep}>Next Step</button>
      )}
      {!nextStep.hasTemplate && nextStep.type === "step" && (
        <button onClick={addTemplate}>Add Template</button>
      )}

      <button onClick={() => {}}>edit</button>
      <button onClick={deleteNode}>delete</button>
    </div>
  );
}
