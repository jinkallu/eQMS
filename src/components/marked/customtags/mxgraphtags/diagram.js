import {
    mxGraph,
    mxRubberband,
    mxKeyHandler,
    mxClient,
    mxUtils,
    mxEvent,
    mxConnectionConstraint,
    mxPoint,
    mxEdgeHandler,
    mxConstraintHandler,
    mxImage,
    mxCellRenderer,
    mxShape,
    mxPopupMenu
} from "mxgraph-js";


var styleElement = document.createElement('style');
// Set the CSS styles
styleElement.innerHTML = `
    body div.mxPopupMenu {
        -webkit-box-shadow: 3px 3px 6px #C0C0C0;
        -moz-box-shadow: 3px 3px 6px #C0C0C0;
        box-shadow: 3px 3px 6px #C0C0C0;
        background: white;
        position: absolute;
        border: 3px solid #e7e7e7;
        padding: 3px;
    }
`;

// Append the <style> element to the document's <head>
document.head.appendChild(styleElement);

mxCellRenderer.registerShape('document', DocumentShape);
function DocumentShape() { }
DocumentShape.prototype = new mxShape();
DocumentShape.prototype.constructor = DocumentShape;
DocumentShape.prototype.paintVertexShape = function (c, x, y, w, h) {
    // Customize the rendering of your document shape here
    var rx = x + w;
    var ry = y + h;
    var waveHeight = 20; // Adjust the height of the sine wave as needed
    var waveLength = w;  // Adjust the length of the sine wave as needed

    c.begin();
    c.moveTo(x, y);
    c.lineTo(x, ry - waveHeight + (Math.sin(0 / waveLength * 2 * Math.PI) * waveHeight));

    // Draw the sine wave-like bottom edge
    for (var i = 0; i <= waveLength; i += 10) { // Adjust the step size as needed
        var px = x + i;
        var py = ry - waveHeight + (Math.sin(i / waveLength * 2 * Math.PI) * waveHeight);
        c.lineTo(px, py);
    }
    c.lineTo(rx, y);

    c.close();
    //c.stroke();
    c.fillAndStroke();
};

mxCellRenderer.registerShape('documents', MultipleDocumentsShape);
function MultipleDocumentsShape() { }
MultipleDocumentsShape.prototype = new mxShape();
MultipleDocumentsShape.prototype.constructor = MultipleDocumentsShape;

MultipleDocumentsShape.prototype.paintVertexShape = function (c, x, y, w, h) {

    var horizontalSpacing = w / 10; // Horizontal spacing between documents
    var verticalSpacing = h / 10; // Vertical spacing between documents
    var numDocuments = 3; // The number of documents to display
    var documentWidth = w - numDocuments * horizontalSpacing; // Width of an individual document
    var documentHeight = h - numDocuments * verticalSpacing; // Height of an individual document

    for (var i = numDocuments - 1; i >= 0; i--) {
        var documentX = x + i * (horizontalSpacing);
        var documentY = y + numDocuments * verticalSpacing - i * (verticalSpacing);

        // Draw an individual document using the DocumentShape
        DocumentShape.prototype.paintVertexShape(c, documentX, documentY, documentWidth, documentHeight);
    }
};

// Function to create the entries in the popupmenu
function createPopupMenu(graph, menu, cell, evt) {
    if (cell == null) {
        return null;
    }
    var model = graph.getModel();



    if (cell != null) {
        if (model.isVertex(cell)) {
            menu.addItem('Add child', null, function () {
                Diagram.addChild(graph, cell);
            });
        }

        menu.addItem('Edit label', null, function () {
            graph.startEditingAtCell(cell);
        });

        if (cell.id != 'treeRoot' &&
            model.isVertex(cell)) {
            menu.addItem('Delete', null, function () {
                //deleteSubtree(graph, cell);
            });
        }

        menu.addSeparator();
    }

    menu.addItem('Fit', null, function () {
        graph.fit();
    });

    menu.addItem('Actual', null, function () {
        graph.zoomActual();
    });

    menu.addSeparator();

    menu.addItem('Print', null, function () {
        var preview = new mxPrintPreview(graph, 1);
        preview.open();
    });

    menu.addItem('Poster Print', null, function () {
        var pageCount = mxUtils.prompt('Enter maximum page count', '1');

        if (pageCount != null) {
            var scale = mxUtils.getScaleForPageCount(pageCount, graph);
            var preview = new mxPrintPreview(graph, scale);
            preview.open();
        }
    });
};



class Diagram {

    loadAndDisplayGraph(container) {
        const xmlContent = '<?xml version="1.0" encoding="UTF-8"?><root><mxCell id="0" /><mxCell id="1" parent="0" /><mxCell id="aprt56099Xa9oZ6ABaVY-1" value="Hello" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="380" y="260" width="120" height="60" as="geometry" /></mxCell></root>';
        mxEvent.disableContextMenu(container);





        const graph = new mxGraph(container);

        // Enables automatic sizing for vertices after editing and
        // panning by using the left mouse button.
        graph.setCellsMovable(false);
        graph.setAutoSizeCells(true);
        graph.setPanning(false);
        graph.centerZoom = false;
        graph.panningHandler.useLeftButtonForPanning = true;

        // Displays a popupmenu when the user clicks
        // on a cell (using the left mouse button) but
        // do not select the cell when the popup menu
        // is displayed
        graph.panningHandler.popupMenuHandler = false;



        /*
        graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
            return createPopupMenu(graph, menu, cell, evt);
        };
        */

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
        mxEvent.disableContextMenu(container);
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

        // Enables automatic sizing for vertices after editing and
        // panning by using the left mouse button.
        graph.setCellsMovable(false);
        graph.setAutoSizeCells(true);
        graph.setPanning(false);
        graph.centerZoom = false;
        graph.panningHandler.useLeftButtonForPanning = true;

        // Displays a popupmenu when the user clicks
        // on a cell (using the left mouse button) but
        // do not select the cell when the popup menu
        // is displayed
        graph.panningHandler.popupMenuHandler = false;
        graph.popupMenuHandler.autoExpand = true;
        /*
                var pointImage = new mxImage(
                    "https://raw.githubusercontent.com/jgraph/mxgraph/master/javascript/src/images/point.gif",
                    5,
                    5
                );
                mxPopupMenu.prototype.submenuImage = pointImage;*/


        graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
            return createPopupMenu(graph, menu, cell, evt);
        };
        // Enable click handling on cells
        graph.setCellsSelectable(true);

        //new mxRubberband(graph);

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
            graph.fit();
            //new mxSwimlaneManager(graph);
            // layouts: mxHierarchicalLayout, mxCircleLayout, mxCompactTreeLayout, mxCompositeLayout, mxFastOrganicLayout, mxParallelEdgeLayout, mxPartitionLayout, mxStackLayout
            //var layout = new mxHierarchicalLayout(graph); // Not sure what it does
            //var layout = new mxStackLayout(graph);
            //layout.resizeParent = true; // Makes sure all children fit into the parent swimlane
            //layout.fill = true; // Applies the size to children if parent size changes
            //layout.execute(swimlaneGroup);
            //swimlaneGroup.geometry.height = swimlaneGroup.geometry.height + 50;


        }

    }

    static addChildCell(graph, type, sourceNode, swimlaneGroup, id, label, y) {
        var shape;
        const stepSpacing = 40;
        const stepHeight = 150;
        const stepWidth = 300;
        var x = 20; 
        y = y + stepSpacing;
        //var y = 20;

        switch (type) {
            case "step":
                shape = "rounded=0;whiteSpace=wrap;html=1;";
                if(sourceNode){
                    x = sourceNode.geometry.x;// + sourceNode.geometry.width + 20;
                    y = sourceNode.geometry.y + sourceNode.geometry.height + stepSpacing;
                }
                
                break;
            case "condition":
                shape = "shape=rhombus;whiteSpace=wrap;html=1;";
                break;
            case "template":
                shape = "shape=documents;whiteSpace=wrap;html=1;align=left;";
                if(sourceNode){
                    x = sourceNode.geometry.x + sourceNode.geometry.width + stepSpacing;
                    y = sourceNode.geometry.y;
                }
                
                break;
            default:
                shape = "rounded=0;whiteSpace=wrap;html=1;";
                break;
        }
        const vertex = graph.insertVertex(
            swimlaneGroup,
            id, // Use the Cytoscape node ID as the vertex ID
            label,
            x, // X-coordinate, you may need to adjust this
            y, // Y-coordinate, you may need to adjust this
            stepWidth, // Width of the vertex
            stepHeight, // Height of the vertex
            shape
        );

        return vertex;
    }

    static addChild(graph, cell) {
        var model = graph.getModel();
        var parent = graph.getDefaultParent();
        var vertex;

        model.beginUpdate();
        try {
            const type = "step";
            const vertex = Diagram.addChildCell(graph, type, cell, swimlaneGroup, id, label, y)

            /*vertex = graph.insertVertex(parent, null, 'Double click to set name');
            var geometry = model.getGeometry(vertex);

            // Updates the geometry of the vertex with the
            // preferred size computed in the graph
            var size = graph.getPreferredSizeForCell(vertex);
            geometry.width = size.width;
            geometry.height = size.height;

            // Adds the edge between the existing cell
            // and the new vertex and executes the
            // automatic layout on the parent
            var edge = graph.insertEdge(parent, null, '', cell, vertex);

            // Configures the edge label "in-place" to reside
            // at the end of the edge (x = 1) and with an offset
            // of 20 pixels in negative, vertical direction.
            edge.geometry.x = 1;
            edge.geometry.y = 0;
            edge.geometry.offset = new mxPoint(0, -20);*/

            //addOverlays(graph, vertex, true);
        }
        finally {
            model.endUpdate();
        }

        return vertex;
    };


    traverseHierarchy(graph, node, process_node_id, swimlaneGroup, mxVertexMap, y = 50) {
        if (node.id() !== process_node_id) {
            const stepHeight = 150;
            const stepWidth = 300;
            const stepSpacing = 40;
            let x = 20;
            y = y + stepSpacing;

            const id = node.id(); // Assuming you have unique node IDs in Cytoscape
            var label = node.data("label"); // Assuming you have labels in Cytoscape nodes
            const type = node.data("type");
            var shape = "";
            var sourceNode = null;

            switch (type) {
                case "step":
                    //shape = "rounded=0;whiteSpace=wrap;html=1;";
                    const connectedStepEdges = node.connectedEdges();
                    for (let i = 0; i < connectedStepEdges.length; i++) {
                        console.log(connectedStepEdges[i].source().id());
                        if (connectedStepEdges[i].source().data("type") === "step") {
                            if (connectedStepEdges[i].source().id() === node.id()) {
                                continue;
                            }
                            sourceNode = mxVertexMap.get(connectedStepEdges[i].source().id());//graph.nodes('[id="'+ connectedEdges[i].source().id() + '"]');
                            //console.log(sourceNode, x, y);
                            //x = sourceNode.geometry.x;// + sourceNode.geometry.width + 20;
                            //y = sourceNode.geometry.y + sourceNode.geometry.height + stepSpacing;
                            //console.log(sourceNode, x, y);
                            break;
                        }
                    }
                    break;

                case "condition":
                    //shape = "shape=rhombus;whiteSpace=wrap;html=1;";
                    label += node.data("result");
                    break;

                case "template":
                    //shape = "shape=documents;whiteSpace=wrap;html=1;align=left;";
                    const connectedEdges = node.connectedEdges();
                    console.log(connectedEdges);
                    for (let i = 0; i < connectedEdges.length; i++) {
                        console.log(connectedEdges[i].source().id());
                        if (connectedEdges[i].source().data("type") === "step") {
                            sourceNode = mxVertexMap.get(connectedEdges[i].source().id());//graph.nodes('[id="'+ connectedEdges[i].source().id() + '"]');
                            //console.log(sourceNode, x, y);
                            //x = sourceNode.geometry.x + sourceNode.geometry.width + stepSpacing;
                            //y = sourceNode.geometry.y;
                            //console.log(sourceNode, x, y);
                            break;
                        }
                    }

                    break;

                default:
                    //shape = "rounded=0;whiteSpace=wrap;html=1;";
                    break;
            }
            
/*const vertex = graph.insertVertex(
                swimlaneGroup,
                id, // Use the Cytoscape node ID as the vertex ID
                label,
                x, // X-coordinate, you may need to adjust this
                y, // Y-coordinate, you may need to adjust this
                stepWidth, // Width of the vertex
                stepHeight, // Height of the vertex
                shape
            );*/
            //console.log(graph, type, sourceNode, swimlaneGroup, id, label);

            const vertex = Diagram.addChildCell(graph, type, sourceNode, swimlaneGroup, id, label, y)
            mxVertexMap.set(id, vertex); // Store the mapping for future reference
        }
        node.children().forEach(childNode => {
            this.traverseHierarchy(graph, childNode, process_node_id, swimlaneGroup, mxVertexMap, y);
        });
    }

}

export default Diagram;
