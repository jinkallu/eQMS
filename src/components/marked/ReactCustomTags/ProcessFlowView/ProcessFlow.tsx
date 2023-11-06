import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  FitView,
} from "reactflow";
import DecisionNode from "./DecisionNode";
import MultiDecisionNode from "./MultiDecisionNode";
import StepNode from "./StepNode";
import TemplateNode from "./TemplateNode";
import TemplatesNode from "./TemplatesNode";

import "reactflow/dist/style.css";
import "./style.css";

import CreateStepModal from "./CreateStepModal";
import CreateStepTemplateModal from "./CreateStepTemplateModal";
import DeleteStepModal from "./DeleteStepModal";
import ContextMenu from "./ContextMenu";

const nodeTypes = {
  decision: DecisionNode,
  multidec: MultiDecisionNode,
  step: StepNode,
  template: TemplateNode,
  templates: TemplatesNode,
  // Define other custom node types here if needed
};

export default function ProcessFlow({ graphData, editable }) {
  const initialNodes = graphData?.initialNodes || [];
  const initialEdges = graphData?.initialEdges || [];

  const [openCreateStepModal, setOpenCreateStepModal] = React.useState(false);
  const [openDeleteStepModal, setOpenDeleteStepModal] = React.useState(false);
  const [openCreateStepTemplateModal, setOpenCreateStepTemplateModal] =
    React.useState(false);
  const [currentNode, setCurrentNode] = React.useState<{
    node: any;
    top: number;
    left: number;
    right: number;
    bottom: number;
  }>();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [menu, setMenu] = useState(null);

  const [viewportSize, setViewportSize] = useState({
    width: "100vw",
    height: "50vh",
  });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    setNodes(graphData?.initialNodes);
    setEdges(graphData?.initialEdges);
  }, [graphData]);

  const ref = useRef(null);

  useEffect(() => {
    //const newViewportSize =  {width: "100vw", height: "150vh" };
    if (nodes && nodes.length > 0) {
      const objectWithLargestY = nodes.reduce((prev, current) => {
        return current.position.y > prev.position.y ? current : prev;
      });

      const newViewportSize = {
        width: "48vw",
        height: objectWithLargestY.position.y + 350 + "px",
      };

      setViewportSize(newViewportSize);
    }
  }, [nodes]);

  function onNodeClick() {
    setMenu(null);
  }

  const onNodeContextMenu = (event, node) => {
    event.preventDefault();

    if (node.type !== "step") {
      setMenu(null);
      return;
    }

    const pane = ref.current.getBoundingClientRect();
    const id = node.id;
    // const top = event.clientY < pane.height - 200 && event.clientY;
    const top = event.clientY;
    // const left = event.clientX < pane.width - 200 && event.clientX;
    const left = event.clientX;
    const right =
      event.clientX >= pane.width - 200 && pane.width - event.clientX;
    const bottom =
      event.clientY >= pane.height - 200 && pane.height - event.clientY;

    const currentNodeData = { node, top, left, right, bottom };
    setCurrentNode(currentNodeData);
    setMenu({
      id,
      top: pane.top + node.position.y,
      left: pane.x + node.position.x + node.width,
      setMenu,
      right,
      bottom,
      myNodes: nodes,
      setMyNodes: setNodes,
      myEdges: edges,
      setMyEdges: setEdges,
      setOpenCreateStepModal,
      setOpenCreateStepTemplateModal,
      setOpenDeleteStepModal,
    });
  };

  //if(editable) {
  return (
    <div
      style={{
        display: "flex",
        width: viewportSize.width,
        height: viewportSize.height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CreateStepModal
        setOpen={setOpenCreateStepModal}
        open={openCreateStepModal}
        currentNode={currentNode}
        setNodes={setNodes}
        setEdges={setEdges}
      ></CreateStepModal>
      <DeleteStepModal
        setOpen={setOpenDeleteStepModal}
        open={openDeleteStepModal}
        currentNode={currentNode}
        setNodes={setNodes}
        setEdges={setEdges}
        edges={edges}
        nodes={nodes}
      ></DeleteStepModal>

      <CreateStepTemplateModal
        setOpen={setOpenCreateStepTemplateModal}
        open={openCreateStepTemplateModal}
        currentNode={currentNode}
        setNodes={setNodes}
        setEdges={setEdges}
      ></CreateStepTemplateModal>

      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        zoomOnDoubleClick={false} // Disable zoom on double-click
        zoomOnScroll={false} // Disable zoom on scroll
        nodesDraggable={false}
        panOnDrag={false}
        zoomOnPinch={false}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        preventScrolling={false}
        elementsSelectable={editable}
      >
        {/* <Controls /> */}
        {/* <MiniMap /> */}
        <Background gap={12} size={1} />
        <Background />){menu && <ContextMenu {...menu}></ContextMenu>}
      </ReactFlow>
    </div>
  );
  //}
}
