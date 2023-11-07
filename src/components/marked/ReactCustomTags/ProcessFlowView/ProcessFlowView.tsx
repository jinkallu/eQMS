import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ProcessFlow from "./ProcessFlow";
import CScape from "../../customtags/cytoscapetags/cscape";

//import GraphAnalysis from "../../customtags/cytoscapetags/GraphAnalysis"; // TODO: for future graph analysis

export default function ProcessFlowView({
  element,
  order,
  state,
  id,
  handleChange,
}) {
  const [graphData, setGraphData] = useState(null);

  function traverseGraph(node, initialNodes, initialEdges, x, y) {
    const id = node.id(); // Assuming you have unique node IDs in Cytoscape
    const label = node.data("label"); // Assuming you have labels in Cytoscape nodes
    const type = node.data("type");
    const templateName = node.data("templateName");
    const templateId = node.data("templateId");
    switch (type) {
      case "step":
        x = 200;
        break;

      case "template":
        y = y - 100;
        x = x + 300;
        break;
    }
    if (type !== "process") {
      initialNodes.push({
        id: id,
        type: type,
        position: {
          x: x,
          y: y,
        },
        data: {
          label,
          type,
          templateName,
          templateId,
        },
        parentNode: "A",
        extent: type,
        draggable: true,
      });
    } else {
      y = y - 50;
    }

    node.children().forEach((childNode) => {
      y = y + 100;
      traverseGraph(childNode, initialNodes, initialEdges, x, y);
    });
  }

  function createProcessGraph(element) {
    const cScape = new CScape();
    const cy = cScape.init(element.id, element);
    const process_node = cy.elements('[type="process"]');

    const initialNodes = [];
    const initialEdges = []; //[{ id: "e1-2", source: "1", target: "2" }];

    initialNodes.push({
      id: "A", // TODO: change this id to a unique
      type: "group",
      data: {
        label: null,
        type: process_node.data("type"),
      },
      position: { x: 0, y: 0 },
      style: {
        width: "100%",
        height: "100%",
      },
      draggable: false,
    });
    initialNodes.push({
      id: process_node.data("label"),
      position: {
        x: 0,
        y: 0,
      },
      style: {
        width: "100%",
        height: 50,
        backgroundColor: "rgba(240,240,240,0.25)",
      },
      data: {
        label: process_node.data("label"),
        type: process_node.data("type") + "_label",
      },
      parentNode: "A",
      extent: "parent",
      draggable: false,
    });

    const mxVertexMap = new Map();

    traverseGraph(process_node, initialNodes, initialEdges, 10, 50);

    const cyEdges = cy.edges();
    cyEdges.forEach((cyEdge) => {
      const sourceId = cyEdge.data().source;
      const targetId = cyEdge.data().target;
      const label = cyEdge.data().label;

      const srcNode = cy.getElementById(sourceId);
      const tgtNode = cy.getElementById(targetId);

      const srcType = srcNode.data("type");
      const tgtType = tgtNode.data("type");

      let sourceHandle, targetHandle;
      switch (srcType) {
        case "step":
          switch (tgtType) {
            case "step":
              sourceHandle = "source_bottom";
              targetHandle = "target";
              break;
            case "template":
              sourceHandle = "source_right";
              targetHandle = "target";
              break;
          }
          break;
      }

      //const sourceVertex = mxVertexMap.get(sourceId);
      //const targetVertex = mxVertexMap.get(targetId);

      //if (sourceVertex && targetVertex) {
      initialEdges.push({
        id: sourceId + "_" + targetId,
        source: sourceId,
        target: targetId,
        targetHandle: targetHandle,
        sourceHandle: sourceHandle,
      });
      //}
    });

    setGraphData({ initialNodes: initialNodes, initialEdges: initialEdges });
  }

  useEffect(() => {
    createProcessGraph(element);
  }, [element]);

  return (
    (order === "middle" && (
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <ProcessFlow graphData={graphData} editable={true} />
        </Grid>
      </Grid>
    )) ||
    (order === "last" && (
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <ProcessFlow graphData={graphData} editable={false} />
        </Grid>
      </Grid>
    ))
  );
}
