import MarkedAzureSDK from "../../MarkedAzureSDK";
import MdFunctions from "../MdFunctions";


class InputTag {

    static register() {
        InputTag.registerCondition();
        InputTag.registerEvents();
    }

    static registerCondition() {
        MarkedAzureSDK.register('input', (element: Element, container_id: string, type: number) => {
            return InputTag.parse(element, container_id, type);
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
        });
    }

    static registerEvents() {
        const parentId = "HTMLEditor"; //TODO: get it from somewhere, not magic string 
        MdFunctions.register(parentId, (pId: string) => {
            return InputTag.registerInputTagEvents(pId);
        });
    }

    static registerInputTagEvents(parentid: string) {
        const parentElement = document.getElementById(parentid);
        const inputElements = parentElement.querySelectorAll('input');
        console.log(inputElements);
        inputElements.forEach((inputElement) => {
            inputElement.addEventListener('input', InputTag.handleInputChange);
        });
    }

    static handleInputChange(event) {
        //const parent_id =  "markedHTMLViewer";
        const edit_id = event.target.id;
        const view_id = edit_id + "_viewer";
        console.log(view_id);
        const viewElement = document.getElementById(view_id);
        viewElement.textContent = event.target.value;

        //TextAreaUpdate.updated(event.target);
    }
}

export default InputTag;