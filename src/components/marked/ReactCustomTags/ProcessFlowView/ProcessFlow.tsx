import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  FitView
} from "reactflow";
import ContextMenu from './ContextMenu';
import DecisionNode from "./DecisionNode";
import StepNode from "./StepNode";
import TemplateNode from "./TemplateNode";
import TemplatesNode from "./TemplatesNode";


import "reactflow/dist/style.css";
import './style.css';

const nodeTypes = {
  decision: DecisionNode,
  step: StepNode,
  template: TemplateNode,
  templates: TemplatesNode
  // Define other custom node types here if needed
};

/*const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];*/

export default function ProcessFlow({ graphData }) {
  const initialNodes = graphData?.initialNodes || [];
  const initialEdges = graphData?.initialEdges || [];

  const [myNodes, setMyNodes] = useState(initialNodes);
  const [myEdges, setMyEdges] = useState(initialEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(myNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(myEdges);
  const [menu, setMenu] = useState(null);

  const [viewportSize, setViewportSize] = useState({ width: "100vw", height: "50vh" });


  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    setNodes(graphData?.initialNodes);
    setEdges(graphData?.initialEdges);
  }, [graphData])

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);
  const ref = useRef(null);

  useEffect(() => {
    //const newViewportSize =  {width: "100vw", height: "150vh" };
    console.log(nodes);
    if(nodes && nodes.length > 0){

    
    const objectWithLargestY = nodes.reduce((prev, current) => {
      return current.position.y > prev.position.y ? current : prev;
    });

    const newViewportSize =  {width: "100vw", height: objectWithLargestY.position.y + 350 + "px" };
    console.log(newViewportSize);

    setViewportSize (newViewportSize);
  }
  }, [nodes])


  const onNodeContextMenu = useCallback(
    (event, node) => {
      //console.log(event, node);
      // Prevent native context menu from showing
      event.preventDefault();
      console.log(nodes);

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
        myNodes: nodes,
        setMyNodes: setNodes,
        myEdges: edges,
        setMyEdges: setEdges,
      });
    },
    [nodes, setNodes, edges, setEdges, setMenu]
  );


  return (
    <div style={{ width: viewportSize.width, height: viewportSize.height }}>
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
        zoomOnScroll={false}     // Disable zoom on scroll
        nodesDraggable={false}
        panOnDrag={false}
        zoomOnPinch={false}
        nodeTypes={nodeTypes}
        
      >
        {/* <Controls /> */}
        <MiniMap />
        <Background gap={12} size={1} />
        <Background />
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
    </div>
  );
}
