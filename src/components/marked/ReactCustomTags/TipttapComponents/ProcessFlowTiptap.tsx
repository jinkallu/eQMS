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
import { SmartStepEdge } from "@tisoap/react-flow-smart-edge";
import DecisionNode from "../ProcessFlowView/DecisionNode";
import MultiDecisionNode from "../ProcessFlowView/MultiDecisionNode";
import StepNode from "../ProcessFlowView/StepNode";
import TemplateNode from "../ProcessFlowView/TemplateNode";
import TemplatesNode from "../ProcessFlowView/TemplatesNode";
import Box from "@mui/material/Box";

import "reactflow/dist/style.css";
import "./ProcessFlowTiptap.css";
import dagre from "dagre";

import CreateStepModal from "../ProcessFlowView/CreateStepModal";
import CreateStepTemplateModal from "../ProcessFlowView/CreateStepTemplateModal";
import DeleteStepModal from "../ProcessFlowView/DeleteStepModal";
import ContextMenu from "../ProcessFlowView/ContextMenu";
import { Button } from "@mui/material";
import { useExtnStore } from "../../../../zustand/store";
import EditStepNameModal from "../ProcessFlowView/EditStepNameModal";
import { NodeViewWrapper } from "@tiptap/react";

const nodeTypes = {
  decision: DecisionNode,
  multidec: MultiDecisionNode,
  step: StepNode,
  template: TemplateNode,
  templates: TemplatesNode,
  // Define other custom node types here if needed
};
const edgeTypes = {
  smart: SmartStepEdge,
};
const flowStyles = {
  background: "#192a43",
  // height: "20em",

  padding: "10px",
  boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
};

export default function ProcessFlowTiptap(props) {
  const { templateState, setTemplateState, pageWidth, templateStateVersion } =
    useExtnStore((state) => state);
  const [openCreateStepModal, setOpenCreateStepModal] = React.useState(false);
  const [openDeleteStepModal, setOpenDeleteStepModal] = React.useState(false);
  const [openEditStepModal, setOpenEditStepModal] = React.useState(false);
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

  const [viewportSize, setViewportSize] = useState({
    width: "100vw",
    height: "50vh",
  });

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 200;
  const nodeHeight = 50;

  const getLayoutedElements = (nodes, edges, direction = "TB") => {
    const isHorizontal = direction === "LR";
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
      node.targetPosition = isHorizontal ? "left" : "top";
      node.sourcePosition = isHorizontal ? "right" : "bottom";

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
    let initialEdges = [];
    try {
      const nodesData = props?.node?.attrs?.nodes
        ? JSON.parse(props?.node?.attrs?.nodes)
        : [];
      initialEdges = props?.node?.attrs?.edges
        ? JSON.parse(props?.node?.attrs?.edges)
        : [];
      initialNodes = [...nodesData];
    } catch (e) {
      initialNodes = [];
      initialEdges = [];
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    setTemplateState("processFlow", {
      nodes: layoutedNodes,
      edges: layoutedEdges,
    });
  }, []);

  const ref = useRef(null);

  useEffect(() => {
    if (
      templateState?.processFlow &&
      templateState?.processFlow?.nodes?.length > 0
    ) {
      const objectWithLargestY = templateState["processFlow"]?.nodes.reduce(
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
  }, [templateState]);

  // useEffect(() => {
  //   if (
  //     templateState &&
  //     templateState?.processFlow &&
  //     props &&
  //     props?.updateAttributes
  //   )
  //     props.updateAttributes({
  //       nodes: templateState?.processFlow?.nodes || [],
  //       edges: templateState?.processFlow?.edges || [],
  //     });
  // }, [templateState?.processFlow]);

  function onNodeClick() {
    setMenu(null);
  }

  function updateProps(nodes, edges) {
    props.updateAttributes({
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
      //
    });
  }

  useEffect(() => {
    queueMicrotask(() =>
      updateProps(
        templateState?.processFlow?.nodes || [],
        templateState?.processFlow?.edges || []
      )
    );
  }, [templateState?.processFlow]);

  const onNodeContextMenu = (event, node) => {
    props.updateAttributes({
      nodes: [],
      edges: [],
    });
    if (!props?.node?.attrs?.editable) {
      setMenu(null);

      return;
    }
    event.preventDefault();

    if (!["step", "group", "multidec"].includes(node.type)) {
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
      setOpenEditStepModal,
      props,
      // toggleEdit,
    });
  };

  //if(editable) {
  return (
    <NodeViewWrapper>
      <Box
        id="renderFlowWrapper"
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          overflow: "auto",
          width: "100%",
        }}
      >
        <CreateStepModal
          setOpen={setOpenCreateStepModal}
          open={openCreateStepModal}
          currentNode={currentNode}
          nodes={(templateState && templateState["processFlow"]?.nodes) || []}
          // updateProps={updateProps}
        ></CreateStepModal>

        <EditStepNameModal
          setOpen={setOpenEditStepModal}
          open={openEditStepModal}
          currentNode={currentNode}
        ></EditStepNameModal>
        <DeleteStepModal
          setOpen={setOpenDeleteStepModal}
          open={openDeleteStepModal}
          currentNode={currentNode}
        ></DeleteStepModal>

        <CreateStepTemplateModal
          setOpen={setOpenCreateStepTemplateModal}
          open={openCreateStepTemplateModal}
          currentNode={currentNode}
          // updateProps={updateProps}
        ></CreateStepTemplateModal>
        {templateState && templateState["processFlow"]?.nodes?.length > 0 ? (
          <ReactFlow
            ref={ref}
            // nodes={state["processFlow"]?.nodes || []}
            nodes={
              templateState?.processFlow?.nodes
                ? getLayoutedElements(
                    templateState?.processFlow?.nodes,
                    templateState?.processFlow?.edges
                  ).nodes
                : []
            }
            edges={templateState?.processFlow?.edges || []}
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
            edgeTypes={edgeTypes}
            onNodeClick={onNodeClick}
            preventScrolling={false}
            elementsSelectable={true}
            style={flowStyles}
            fitView
          >
            {/* <Controls /> */}
            {/* <MiniMap /> */}
            <Background gap={12} size={1} />
            <Background />
            {menu && <ContextMenu {...menu}></ContextMenu>}
          </ReactFlow>
        ) : (
          <Box sx={{ display: "flex", height: "100px" }}>
            <Button
              variant="contained"
              onClick={() => setOpenCreateStepModal(true)}
            >
              Add Step
            </Button>
          </Box>
        )}
      </Box>
    </NodeViewWrapper>
  );
  //}
}
