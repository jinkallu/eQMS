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
import ContextMenu from "./ContextMenu";
import DecisionNode from "./DecisionNode";
import MultiDecisionNode from "./MultiDecisionNode";
import StepNode from "./StepNode";
import TemplateNode from "./TemplateNode";
import TemplatesNode from "./TemplatesNode";

import "reactflow/dist/style.css";
import "./style.css";
import "./MultiDecisionNode.css";

import CreateStepModal from "./CreateStepModal";
import CreateStepTemplateModal from "./CreateStepTemplateModal";
import DeleteStepModal from "./DeleteStepModal";

const nodeTypes = {
  decision: DecisionNode,
  multidec: MultiDecisionNode,
  step: StepNode,
  template: TemplateNode,
  templates: TemplatesNode,
  // Define other custom node types here if needed
};

/*const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];*/

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

  // const [myNodes, setMyNodes] = useState(initialNodes);
  // const [myEdges, setMyEdges] = useState(initialEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [menu, setMenu] = useState(null);

  const [viewportSize, setViewportSize] = useState({
    width: "100vw",
    height: "50vh",
  });

  /* const [editable, setEditable] = useState(true);
  if(order === "last"){
    setEditable(false);
  }*/

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    setNodes(graphData?.initialNodes);
    setEdges(graphData?.initialEdges);
  }, [graphData]);

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);
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

  const onNodeContextMenu = useCallback(
    (event, node) => {
      //console.log(event, node);
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      const id = node.id;
      const top = event.clientY < pane.height - 200 && event.clientY;
      const left = event.clientX < pane.width - 200 && event.clientX;
      const right =
        event.clientX >= pane.width - 200 && pane.width - event.clientX;
      const bottom =
        event.clientY >= pane.height - 200 && pane.height - event.clientY;

      const currentNodeData = { node, top, left, right, bottom };
      setCurrentNode(currentNodeData);
      setMenu({
        id,
        top,
        left,
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
    },
    [nodes, setNodes, edges, setEdges, setMenu]
  );

  function onNodeClick(e, node) {
    console.log(e, node);
    // To remove the context menu, if active
    setMenu(null);
  }

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
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        zoomOnDoubleClick={false} // Disable zoom on double-click
        zoomOnScroll={false} // Disable zoom on scroll
        nodesDraggable={false}
        panOnDrag={false}
        zoomOnPinch={false}
        nodeTypes={nodeTypes}
        preventScrolling={false}
        onNodeClick={onNodeClick}
        elementsSelectable={editable}
      >
        {/* <Controls /> */}
        {/* <MiniMap /> */}
        <Background gap={12} size={1} />
        <Background />
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
    </div>
  );
  //}
}
