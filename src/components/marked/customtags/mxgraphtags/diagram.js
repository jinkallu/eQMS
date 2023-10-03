mxClient.mxBasePath = 'mxgraph/src';
import mxClient from "script-loader!mxgraph/javascript/mxClient";


class Diagram {
    loadAndDisplayGraph(container) {
        const xmlContent = '<?xml version="1.0" encoding="UTF-8"?><root><mxCell id="0" /><mxCell id="1" parent="0" /><mxCell id="aprt56099Xa9oZ6ABaVY-1" value="Hello" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="380" y="260" width="120" height="60" as="geometry" /></mxCell></root>';
        mxEvent.disableContextMenu(container);

        const graph = new mxGraph(container);

        const xmlDoc = mxUtils.parseXml(xmlContent);
        const codec = new mxCodec(xmlDoc);

        var elt = xmlDoc.documentElement.firstChild;
        var cells = [];

        while (elt != null) {
            cells.push(codec.decodeCell(elt));
            graph.refresh();
            elt = elt.nextSibling;
        }

        graph.addCells(cells);
    }

    testDiagram(container) {
        //mxEvent.disableContextMenu(container);
        /*
                const xmlDoc = mxUtils.parseXml(xmlContent);
                const codec = new mxCodec(xmlDoc);
                const node = xmlDoc.documentElement;
        
                // Decode and render the XML content onto the graph
                codec.decode(node, graph.getModel());
                console.log(container);*/



        // Disables the built-in context menu
        mxEvent.disableContextMenu(container);

        // Creates the graph inside the given container
        var graph = new mxGraph(container);

        // Enables rubberband selection
        new mxRubberband(graph);

        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        var parent = graph.getDefaultParent();

        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
            var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
            var e1 = graph.insertEdge(parent, null, '', v1, v2);
        }
        finally {
            // Updates the display
            graph.getModel().endUpdate();
        }


    }

    processflow(processFlowElement, container) {
        mxEvent.disableContextMenu(container);
        var graph = new mxGraph(container);

        new mxRubberband(graph);

        var parent = graph.getDefaultParent();

        //const processFlowElement = xmlDoc.querySelector("processflow");

        if (processFlowElement) {
            const steps = processFlowElement.querySelectorAll("step");
            const stepHeight = 60;
            const stepWidth = 120;
            const stepSpacing = 20;
            let y = stepSpacing;

            graph.getModel().beginUpdate();

            try {
                for (const step of steps) {
                    const stepName = step.getAttribute("name");
                    const vertex = graph.insertVertex(
                        parent,
                        null,
                        stepName,
                        stepSpacing,
                        y,
                        stepWidth,
                        stepHeight
                    );

                    if (y > stepSpacing) {
                        const edge = graph.insertEdge(parent, null, "", prevVertex, vertex);
                    }

                    const prevVertex = vertex;
                    y += stepHeight + stepSpacing;
                }
            } finally {
                graph.getModel().endUpdate();
            }
        }
    }

    processflowFromCytoscape(cytoscapeGraph, container) {
        mxEvent.disableContextMenu(container);
        var graph = new mxGraph(container);

        // Enable click handling on cells
        graph.setCellsSelectable(true);
        graph.addListener(mxEvent.CLICK, function (sender, evt) {
            console.log(evt);
            var cell = evt.getProperty("cell"); // Get the clicked cell (vertex)
            if (cell != null && cell.isVertex()) {
                console.log("Vertex clicked:", cell.getValue());
            }
        });

        new mxRubberband(graph);

        var parent = graph.getDefaultParent();
        graph.getModel().beginUpdate();
        try {

            const cyNodes = cytoscapeGraph.nodes(); // Assuming you have the nodes in your Cytoscape graph
            const cyEdges = cytoscapeGraph.edges(); // Assuming you have the edges in your Cytoscape graph
            //console.log(cyEdges);

            const stepHeight = 60;
            const stepWidth = 120;
            const stepSpacing = 20;
            let y = 50 + stepSpacing;

            const process_node = cytoscapeGraph.elements('[type="process"]');
            console.log("ppp ", process_node);
            //const edgesWithParent = process_node.connectedEdges();
            //console.log(process_node.id());
            var swimlaneGroup = graph.insertVertex(parent, null, process_node.data("label"), 20, 20, 800, 300, 'shape=swimlane;childLayout=stackLayout;horizontal=1;startSize=50;horizontalStack=0;rounded=1;fontSize=14;fontStyle=0;strokeWidth=2;resizeParent=0;resizeLast=1;shadow=0;dashed=0;align=center;arcSize=4;whiteSpace=wrap;html=1;');
            const mxVertexMap = new Map(); // To map Cytoscape nodes to corresponding mxGraph vertices

            this.traverseHierarchy(graph, process_node, process_node.id(), swimlaneGroup, mxVertexMap);

            // Iterate through Cytoscape edges and create corresponding mxGraph edges
            cyEdges.forEach(cyEdge => {
                //console.log(cyEdge.data());
                const sourceId = cyEdge.data().source; // Assuming you have a 'source' field in Cytoscape edges
                const targetId = cyEdge.data().target; // Assuming you have a 'target' field in Cytoscape edges
                const label = cyEdge.data().label;
                //console.log(label);

                const sourceVertex = mxVertexMap.get(sourceId);
                const targetVertex = mxVertexMap.get(targetId);

                if (sourceVertex && targetVertex) {
                    graph.insertEdge(
                        swimlaneGroup,
                        null, // Use null for edge ID
                        label, // No label for the edge
                        sourceVertex,
                        targetVertex
                    );
                }
                else {
                    console.log("Error", cyEdge);
                }
            });



        } finally {

            graph.getModel().endUpdate();
            new mxSwimlaneManager(graph);
            // layouts: mxHierarchicalLayout, mxCircleLayout, mxCompactTreeLayout, mxCompositeLayout, mxFastOrganicLayout, mxParallelEdgeLayout, mxPartitionLayout, mxStackLayout
            var layout = new mxHierarchicalLayout(graph); // Not sure what it does
            layout.resizeParent = true; // Makes sure all children fit into the parent swimlane
            layout.fill = true; // Applies the size to children if parent size changes
            layout.execute(swimlaneGroup);


        }

    }

    traverseHierarchy(graph, node, process_node_id, swimlaneGroup, mxVertexMap, y = 50) {
        if (node.id() !== process_node_id) {
            const stepHeight = 60;
            const stepWidth = 120;
            const stepSpacing = 20;
            y = y + stepSpacing;

            const id = node.id(); // Assuming you have unique node IDs in Cytoscape
            var label = node.data("label"); // Assuming you have labels in Cytoscape nodes
            const type = node.data("type");
            var shape = "";
            //console.log(type);
            switch (type) {
                case "step":
                    shape = "rounded=0;whiteSpace=wrap;html=1;";
                    break;

                case "condition":
                    shape = "shape=rhombus;whiteSpace=wrap;html=1;";
                    label += node.data("result");
                    break;

                case "template":
                    shape = "shape=swimlane;";
                    break;

                default:
                    shape = "rounded=0;whiteSpace=wrap;html=1;";
                    break;
            }
            const vertex = graph.insertVertex(
                swimlaneGroup,
                id, // Use the Cytoscape node ID as the vertex ID
                label,
                stepSpacing, // X-coordinate, you may need to adjust this
                y, // Y-coordinate, you may need to adjust this
                stepWidth, // Width of the vertex
                stepHeight, // Height of the vertex
                shape
            );
            y += stepHeight + stepSpacing;

            mxVertexMap.set(id, vertex); // Store the mapping for future reference
        }
        node.children().forEach(childNode => {
            this.traverseHierarchy(graph, childNode, process_node_id, swimlaneGroup, mxVertexMap, y);
        });
    }

}

export default Diagram;
