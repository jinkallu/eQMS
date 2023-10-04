import * as acorn from 'acorn';

class MathEvaluator {
    static evaluate(mathElement: HTMLElement, triggerElement: HTMLElement) {
        const expression = mathElement.getAttribute("math");
        const program = acorn.parse(expression, { ecmaVersion: 2020 });
        console.log(program);
        MathEvaluator.visitNodes(program, mathElement, triggerElement);
    }

    static visitNodes(nodes, mathElement: HTMLElement, triggerElement: HTMLElement) {
        for (const node of nodes.body) {
            const result = MathEvaluator.traverse(node, mathElement, triggerElement);
            console.log(result);
            if (!result.match) { // no math ops corresponding this trigger.
                continue;
            }

            if (mathElement.tagName == "TH") {
                const colCell = MathEvaluator.getCellRowCol(mathElement);
                const rowCell = MathEvaluator.getCellRowCol(triggerElement);
                const cell = MathEvaluator.getTableCell(rowCell.r, colCell.c, mathElement);

                console.log(colCell, rowCell, cell);
                cell.textContent = result.value;
                //console.log()
            }
            else if (mathElement.tagName == "TD") {
                mathElement.textContent = result.value;
            }

        }
    }

    static traverse(node, mathElement: HTMLElement, triggerElement: HTMLElement) {
        //console.log(node.type);
        switch (node.type) {
            case 'ExpressionStatement':
                return this.traverse(node.expression, mathElement, triggerElement);
            case 'BinaryExpression':
                return this.visitBinaryExpression(node, mathElement, triggerElement);
            case 'Identifier':
                return this.visitIdentifier(node, mathElement, triggerElement);
            case 'Literal':
                return this.visitLiteral(node);
            case 'CallExpression':
                return this.visitCallExpression(node, mathElement, triggerElement);
        }
    }

    static visitCallExpression(node, mathElement: HTMLElement, triggerElement: HTMLElement){
        // TODO: Error management, if calle.type is not identifier?
        const functionName = node.callee.name.toUpperCase();
        switch (functionName) {
            case 'SUM': // make sure that arguments has array length 1
                return this.sumFunction(node.arguments[0], mathElement, triggerElement);
        }
    }

    static sumFunction(node, mathElement: HTMLElement, triggerElement: HTMLElement){
        const intermediate = this.traverse(node, mathElement, triggerElement);
        // TODO: make sure that left column is less than or equal to right column
        // also make sure row 1 is smaller than row 2
        if(intermediate.leftNode.c > intermediate.rightNode.c){
            console.log("Error");
            return null;
        }
        if(intermediate.leftNode.r >= intermediate.rightNode.r){
            console.log("Error");
            return null;
        }
        let result = 0;
        for (let i = intermediate.leftNode.c; i <= intermediate.rightNode.c; i++){
            for (let j = intermediate.leftNode.r; j <= intermediate.rightNode.r; j++){
                const cell = this.getTableCell(j, i, triggerElement);
                result += parseFloat((cell as HTMLInputElement).value); // TODO: types
            }
        }

        // Check if triggered cell belowngs to the range of sum equation
        const triggerRC = this.getCellRowCol(triggerElement);
        let match = false;
        if(
           triggerRC.r >= intermediate.leftNode.r && 
           triggerRC.r <= intermediate.rightNode.r &&
           triggerRC.c >= intermediate.leftNode.c && 
           triggerRC.c <= intermediate.rightNode.c
        ){
            match = true;
        }

        
        return { value: result, match: match };
        //return this.traverse(node, mathElement, triggerElement)
    }

    static visitBinaryExpression(node, mathElement: HTMLElement, triggerElement: HTMLElement) {
        const leftNode = this.traverse(node.left, mathElement, triggerElement)
        const operator = node.operator
        const rightNode = this.traverse(node.right, mathElement, triggerElement)

        const match = leftNode.match || rightNode.match;// add match = false for all literals
        let result = null;
        switch (operator) {
            case '+':
                result = leftNode.value + rightNode.value;
                return { value: result, match: match };
            case '-':
                result = leftNode.value - rightNode.value;
                return { value: result, match: match };
            case '/':
                result = leftNode.value / rightNode.value;
                return { value: result, match: match };
            case '*':
                result = leftNode.value * rightNode.value;
                return { value: result, match: match };
            case '>>':
                //console.log(leftNode, rightNode);
                return { leftNode: leftNode, rightNode: rightNode, match: match };

        }
    }

    static visitLiteral(node){
        return {value: node.value, match: false};
    }

    static visitIdentifier(node, mathElement: HTMLElement, triggerElement: HTMLElement) {
        const name = node.name;
        const identifierRegex = /([A-Za-z]+)([0-9]+)?/;
        const match = node.name.match(identifierRegex);
        if (match) {
            const letterPart = match[1];
            const numberPart = match[2] || ''; // Use an empty string if no number

            return MathEvaluator.IdentifierData(letterPart, numberPart, mathElement, triggerElement);
        }
    }

    static IdentifierData(letterPart, numberPart, mathElement: HTMLElement, triggerElement: HTMLElement) {
        if (numberPart === '') {
            // only letter part present. Make sure math is coming from <th>
            //console.log( mathElement.tagName, triggerElement.tagName);
            if (mathElement.tagName === "TH") {
                const mathRC = MathEvaluator.getCellRowCol(mathElement);
                const trigRC = MathEvaluator.getCellRowCol(triggerElement);

                const mathExpCol = MathEvaluator.columnLabelToNumber(letterPart);
                if (mathExpCol === trigRC.c) {
                    // return a tru also with the result, if the trigger matches with the math expression, so that we know 
                    // this expression is relevent for this change.
                    // if one of the return is not true, then discard any changes
                    // OR all flags.
                    const value = (triggerElement as HTMLInputElement).value;

                    return { value: value, match: true };
                }
                else {
                    // find the cell data corresponding to the column and trigger element row
                    const cell = MathEvaluator.getTableCell(trigRC.r, mathExpCol, triggerElement);
                    const value = (cell as HTMLInputElement).value;
                    return { value: value, match: false };
                }
                //console.log(letterPart, ":", mathExpCol, trigRC, mathRC);
            }
        }
        else { // specific cell
            const mathExpCol = MathEvaluator.columnLabelToNumber(letterPart);
            const cell = MathEvaluator.getTableCell(numberPart, mathExpCol, triggerElement);
            const trigRC = MathEvaluator.getCellRowCol(triggerElement);
            const value = (cell as HTMLInputElement).value;
            console.log(mathExpCol, numberPart, trigRC);
            if ((mathExpCol === trigRC.c) && parseInt(numberPart) === trigRC.r) {
                return { value: value, match: true , c: mathExpCol, r: numberPart};
            }
            else {
                return { value: value, match: false, c: mathExpCol, r: numberPart };
            }
        }
    }

    static getTableCell(row: number, col: number, trigger: HTMLElement) {
        const parentTable = trigger.closest("table");
        const cell = parentTable.rows[row].cells[col];
        const containsInputElement = cell.querySelector('input');
        if (containsInputElement) {
            return containsInputElement;
        }
        return cell;
    }

    static columnLabelToNumber(columnLabel) {
        // Convert the string to uppercase for consistency
        const uppercaseLabel = columnLabel.toUpperCase();

        let result = 0;
        for (let i = 0; i < uppercaseLabel.length; i++) {
            const char = uppercaseLabel.charAt(i);
            const charValue = char.charCodeAt(0) - 'A'.charCodeAt(0) + 1;

            result = result * 26 + charValue - 1;
        }
        console.log(result);
        return result;
    }

    static getCellRowCol(cell: HTMLElement) {
        let parentCell = null;
        if (cell.tagName === "TH") {
            parentCell = cell;
        }
        else if (cell.tagName === "INPUT") {
            parentCell = cell.closest("td");
        }

        let parentRow = parentCell.closest("tr");
        let rowNumber = parentRow.rowIndex;
        var cells = null;
        if (cell.tagName === "TH") {
            cells = parentRow.getElementsByTagName("th");
        }
        else {
            cells = parentRow.getElementsByTagName("td");
        }
        var columnNumber = Array.prototype.indexOf.call(cells, parentCell);
        return { r: rowNumber, c: columnNumber };
    }
}

// TODO: get table (event target first table)
// get event cell row and column, already calculated 
// let res = TableTag.cellRowCol(event.target);
// get math operator cell, if it is a a <th, then 
// get res cell data, and from the th cell column, and cell data row, get the row column of the resulting cell and copy the result theer.
// Do a prechecl on the 

export default MathEvaluator;

