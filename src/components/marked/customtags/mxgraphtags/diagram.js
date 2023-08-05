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
}

export default Diagram;
