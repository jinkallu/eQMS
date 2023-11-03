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
import StepNode from "./StepNode";
import TemplateNode from "./TemplateNode";
import TemplatesNode from "./TemplatesNode";

import "reactflow/dist/style.css";
import "./style.css";
import CreateStepModal from "./CreateStepModal";
import CreateStepTemplateModal from "./CreateStepTemplateModal";

const nodeTypes = {
  decision: DecisionNode,
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
  const [openCreateStepTemplateModal, setOpenCreateStepTemplateModal] =
    React.useState(false);
  const [stepName, setStepName] = React.useState("");
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

  function createStep() {
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

    const myNewNodes = [...nodes];
    myNewNodes.push(newNode);
    const processflowId = "A";

    const foundElement = myNewNodes.find(
      (element) => element.id === processflowId
    );
    if (foundElement) {
      foundElement.style.height = position.y + 300;
    }
    // setMyNodes(myNewNodes);

    setNodes((nodes) => {
      return [...nodes, newNode];
    });

    const newEdge = {
      id: currentNode.node.id + "_" + newNode.id,
      source: currentNode.node.id,
      target: newNode.id,
      sourceHandle: "source_bottom",
      targetHandle: "target",
    };

    const myNewEdges = [...edges];
    myNewEdges.push(newEdge);
    // setMyEdges(myNewEdges);
    setEdges((edges) => {
      return [...edges, newEdge];
    });
  }

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
        stepName,
      });
    },
    [nodes, setNodes, edges, setEdges, setMenu]
  );

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
        stepName={stepName}
        setStepName={setStepName}
        createStep={createStep}
      ></CreateStepModal>

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
