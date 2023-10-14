mxClient.mxBasePath = 'mxgraph/src';
import mxClient from "script-loader!mxgraph/javascript/mxClient";

class CustomCellShapes {

    regiesterShapes(mxCellRenderer) {
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
    }
}

export default CustomCellShapes;