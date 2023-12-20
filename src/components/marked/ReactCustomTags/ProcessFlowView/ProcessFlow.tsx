import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  FitView,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import DecisionNode from "./DecisionNode";
import MultiDecisionNode from "./MultiDecisionNode";
import StepNode from "./StepNode";
import TemplateNode from "./TemplateNode";
import TemplatesNode from "./TemplatesNode";

import "reactflow/dist/style.css";
import "./style.css";
import dagre from 'dagre';


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

export default function ProcessFlow({
  editable,
  handleChange,
  element,
  state,
}) {
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

  const [menu, setMenu] = useState(null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState(null);

  const [viewportSize, setViewportSize] = useState({
    width: "100vw",
    height: "50vh",
  });

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 200;
  const nodeHeight = 36;

  const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });
  
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
  
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
  
    dagre.layout(dagreGraph);
  
    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? 'left' : 'top';
      node.sourcePosition = isHorizontal ? 'right' : 'bottom';
  
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
  
      return node;
    });
  
    return { nodes, edges };
  };
  

  useEffect(() => {
    // createProcessGraph(element);
    let initialNodes = [];

    const nodesData = element?.dataset?.nodes
      ? JSON.parse(element?.dataset?.nodes)
      : [];
    const initialEdges = element?.dataset?.edges
      ? JSON.parse(element?.dataset?.edges)
      : [];
    initialNodes.push({
      id: "A", // TODO: change this id to a unique
      data: {
        label: "SOP Name",
      },
      type: "group",
      position: { x: 0, y: 0 },
      style: {
        height: "100%",
        width: "100%",
      },
      draggable: true,
    });

    if (nodesData?.find((item) => item?.id === "A")) {
      // const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      //   nodes,
      //   edges,
      // );

      //setNodes([...layoutedNodes]);
      //setEdges([...layoutedEdges]);
      initialNodes = [...nodesData];
    } else {
      initialNodes = [...initialNodes, ...nodesData];
    }
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
    );
    handleChange("processFlow", { nodes: layoutedNodes, edges: layoutedEdges });
  }, []);

  const ref = useRef(null);

  useEffect(() => {
    if (state?.processFlow && state?.processFlow?.nodes?.length > 0) {
      const objectWithLargestY = state["processFlow"]?.nodes.reduce(
        (prev, current) => {
          return current.position.y > prev.position.y ? current : prev;
        }
      );

      const newViewportSize = {
        width: "48vw",
        height: objectWithLargestY.position.y + 350 + "px",
      };

      setViewportSize(newViewportSize);
    }
  }, [state]);

  function onNodeClick() {
    setMenu(null);
  }

  const onNodeContextMenu = (event, node) => {
    if (!editable) {
      setMenu(null);

      return;
    }
    event.preventDefault();

    if (!["step", "group"].includes(node.type)) {
      setMenu(null);
      return;
    }

    const pane = ref.current.getBoundingClientRect();
    const id = node.id;
    const top = event.clientY;

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
      // top: pane.top,
      left: pane.x,
      // left: pane.x + node.position.x + node.width,
      setMenu,
      right,
      bottom,
      setOpenCreateStepModal,
      setOpenCreateStepTemplateModal,
      setOpenDeleteStepModal,
      // toggleEdit,
    });
  };

  //if(editable) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: viewportSize.height,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <CreateStepModal
        setOpen={setOpenCreateStepModal}
        open={openCreateStepModal}
        currentNode={currentNode}
        state={state}
        handleChange={handleChange}
      ></CreateStepModal>
      <DeleteStepModal
        setOpen={setOpenDeleteStepModal}
        open={openDeleteStepModal}
        currentNode={currentNode}
        state={{}}
        handleChange={handleChange}
      ></DeleteStepModal>

      <CreateStepTemplateModal
        setOpen={setOpenCreateStepTemplateModal}
        open={openCreateStepTemplateModal}
        currentNode={currentNode}
        state={state}
        handleChange={handleChange}
      ></CreateStepTemplateModal>

      <ReactFlow
        ref={ref}
        // nodes={state["processFlow"]?.nodes || []}
        nodes={state?.processFlow?.nodes? getLayoutedElements(
          state?.processFlow?.nodes,
          state?.processFlow?.edges,
        ).nodes: []}
        edges={state?.processFlow?.edges || []}
        // edges={state["processFlow"]?.edges || []}
        // onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        zoomOnDoubleClick={false} // Disable zoom on double-click
        zoomOnScroll={false} // Disable zoom on scroll
        nodesDraggable={true}
        panOnDrag={false}
        zoomOnPinch={false}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        preventScrolling={false}
        elementsSelectable={true}
      >
        {/* <Controls /> */}
        {/* <MiniMap /> */}
        <Background gap={12} size={1} />
        <Background />{menu && <ContextMenu {...menu}></ContextMenu>}
      </ReactFlow>
    </div>
  );
  //}
}
