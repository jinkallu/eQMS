import MarkedAzureSDK from "../../useMarkedAzureSDK";
import MdFunctions from "../MdFunctions";
import MathEvaluator from "./MathEvaluator";

const useTableTag = () => {

    const registerAll() {
        TableTag.registerCondition();
        TableTag.registerEvents();
    }

    static registerCondition() {
        MarkedAzureSDK.register('table', (element: Element, container_id: string, type: number) => {
            return TableTag.parse(element, container_id, type);
        });
    }

    static async parse(element: Element, container_id: string, type: number): Promise<HTMLElement | null> {
        return new Promise((resolve, reject) => {
            console.log(container_id, type);
            element.id = container_id;
            let inputLevelAttribute = element.getAttribute('inputlevel');
            if (inputLevelAttribute === null  || inputLevelAttribute === '') {
                inputLevelAttribute = '0';
                element.setAttribute('inputlevel', inputLevelAttribute);
            }

            resolve(element as HTMLElement);
            /*

            if (type === 0) { // Editor
                if (inputLevelAttribute === '0') {
                    (element as HTMLInputElement).disabled = true;
                    resolve(element as HTMLElement);
                }

                else {
                    (element as HTMLInputElement).disabled = true;
                    resolve(element as HTMLElement);
                }
            }
            else if (type === 1) { // HTMLEditor
                if (inputLevelAttribute === '0') {
                    (element as HTMLInputElement).disabled = false;
                    resolve(element as HTMLElement);
                }

                else {
                    (element as HTMLInputElement).disabled = true;
                    resolve(element as HTMLElement);
                }
            }
            else if (type === 2) { // HTMLViewer
                if (inputLevelAttribute === '0') {
                    const spanElement = document.createElement('span');
                    //spanElement.id = element.id;
                    

                    let attributes = element.attributes;
                    for (let i = 0; i < attributes.length; i++) {
                        let attributeName = attributes[i].name;
                        let attributeValue = attributes[i].value;
                        //console.log(attributeName, attributeValue);
                        if(attributeName === "value"){
                            spanElement.textContent = attributeValue; 
                        }
                        else{
                            spanElement.setAttribute(attributeName, attributeValue); 
                        }
                         
                    }
                    if (spanElement.textContent.trim() === '') {
                        spanElement.textContent = "Fill the input!";
                    }
                    //console.log(spanElement);


                    //(element as HTMLInputElement).disabled = true;
                    resolve(spanElement as HTMLElement);
                }

                else {
                    (element as HTMLInputElement).disabled = true;
                    resolve(element as HTMLElement);
                }
            }
            */
        });
    }

    static registerEvents() {
        const parentId = "HTMLEditor"; //TODO: get it from somewhere, not magic string 
        MdFunctions.register(parentId, (pId: string) => {
            return TableTag.registerInputTagEvents(pId);
        });
    }

    static registerInputTagEvents(parentid: string) {
        const parentElement = document.getElementById(parentid);
        const inputElements = parentElement.querySelectorAll('table');
        console.log(inputElements);
        inputElements.forEach((inputElement) => {
            inputElement.addEventListener('input', TableTag.handleInputChange);
        });
    }

    static cellRowCol(target){
        let parentCell = target.closest("td");
        let parentRow = target.closest("tr");
        let rowNumber = parentRow.rowIndex;

        var cells = parentRow.getElementsByTagName("td"); 
        var columnNumber = Array.prototype.indexOf.call(cells, parentCell);

        return {r: rowNumber, c: columnNumber};
    }

    static cellsWithMath(target){
        let table = target.closest("table");
        let elementsWithMathAttribute = table.querySelectorAll('[math]');
        //for(let i = 0; i < elementsWithMathAttribute.length; i++){
        //    console.log(elementsWithMathAttribute[i].getAttribute("math"));
        //}
        return elementsWithMathAttribute;
        //console.log(elementsWithMathAttribute.length);
        //console.log(elementsWithMathAttribute[0].getAttribute("math"));
        // TODO: PArse the math expression and implement the corresponding...

    }

    /*static evaluateExpression(expression, rowData) {
        // Convert the expression to a JavaScript function
        const jsCode = `(${expression})`;
        const compiled = new Function('rowData', 'return ' + jsCode);
      
        // Evaluate the expression with the provided row data
        return compiled(rowData);
      }*/

    static parseMath(mathElement: HTMLElement, triggerElement: HTMLElement){
        //const expression = element.getAttribute("math");
        MathEvaluator.evaluate(mathElement, triggerElement);
        //const expression = element.getAttribute("math");
        //console.log(expression);
        //const body = acorn.parse(expression, {ecmaVersion: 2020});
        //console.log(body);
    }

    static handleInputChange(event) {
        
        let res = TableTag.cellRowCol(event.target);
        console.log(res.r, res.c);
        const elementsWithMathAttribute = TableTag.cellsWithMath(event.target);
        for(let i = 0; i < elementsWithMathAttribute.length; i++){
            TableTag.parseMath(elementsWithMathAttribute[i], event.target)
        }

        //const parent_id =  "markedHTMLViewer";
        /*
        const edit_id = event.target.id;
        const view_id = edit_id + "_viewer";
        console.log(view_id);
        const viewElement = document.getElementById(view_id);
        viewElement.textContent = event.target.value;
        */

        //TextAreaUpdate.updated(event.target);
    }
}

export default TableTag;