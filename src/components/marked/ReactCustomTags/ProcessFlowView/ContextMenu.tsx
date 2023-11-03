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
  stepName,
  ...props
}) {
  const { getNode, getNodes, addNodes, addEdges, setEdges, getEdges, fitView } =
    useReactFlow();
  const [nextStep, setNextStep] = useState({
    hasNextStep: true,
    hasTemplate: true,
  });

  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };
    //const newNodes = ;
    //console.log(newNodes);
    addNodes({ ...node, id: `${node.id}-copy`, position });
    //console.log(getNode(`${node.id}-step`))
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    //setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setEdges]);

  const addNextStep = () => {
    setOpenCreateStepModal(true);
  };

  const addTemplate = () => {
    setOpenCreateStepTemplateModal(true);
  };
  useEffect(() => {
    const node = getNode(id);
    if (node.data.type === "template") {
      setNextStep({ hasNextStep: true, hasTemplate: true });
    } else if (node.data.type === "step") {
      const edges = getEdges();
      const connectedChildren = edges.filter((edge) => edge.source == id);
      const stepData = { hasNextStep: false, hasTemplate: false };
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
      {!nextStep.hasNextStep && (
        <button onClick={addNextStep}>Next Step</button>
      )}
      {!nextStep.hasTemplate && (
        <button onClick={addTemplate}>Add Template</button>
      )}
      <button onClick={duplicateNode}>duplicate</button>
      <button onClick={deleteNode}>delete</button>
    </div>
  );
}
