import MarkedAzureSDK from "../../useMarkedAzureSDK";
import MdFunctions from "../MdFunctions";
import { marked } from 'marked';


class InputTextAreaTag {

    static register() {
        InputTextAreaTag.registerCondition();
        InputTextAreaTag.registerEvents();
    }

    static registerCondition() {
        // MarkedAzureSDK.register('textarea', (element: Element, container_id: string, type: number) => {
        //     return InputTextAreaTag.parse(element, container_id, type);
        // });
    }

    static async parse(element: Element, container_id: string, type: number): Promise<HTMLElement | null> {
        return new Promise((resolve, reject) => {
            console.log(container_id, type);
            element.id = container_id;
            let inputLevelAttribute = element.getAttribute('inputlevel');
            if (inputLevelAttribute === null || inputLevelAttribute === '') {
                inputLevelAttribute = '0';
                element.setAttribute('inputlevel', inputLevelAttribute);
            }

            let valueAttribute = element.getAttribute('value');
            if (valueAttribute === null) {
                valueAttribute = '';
                element.setAttribute('value', valueAttribute);
            }


            element.setAttribute('type', "input");

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
                    const spanElement = document.createElement('div');
                    //spanElement.id = element.id;


                    let attributes = element.attributes;
                    for (let i = 0; i < attributes.length; i++) {
                        let attributeName = attributes[i].name;
                        let attributeValue = attributes[i].value;
                        //console.log(attributeName, attributeValue);
                        if (attributeName === "value") {
                            if (attributeValue.trim() === '') {
                                spanElement.innerHTML = "Fill the Textarea input!";
                            }
                            else {
                                InputTextAreaTag.mdToHTML(spanElement, attributeValue);
                            }

                        }
                        else {
                            spanElement.setAttribute(attributeName, attributeValue);
                        }

                    }
                    
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
            return InputTextAreaTag.registerInputTagEvents(pId);
        });
    }

    static registerInputTagEvents(parentid: string) {
        const parentElement = document.getElementById(parentid);
        const inputElements = parentElement.querySelectorAll('textarea[type="input"]');
        console.log(inputElements);
        inputElements.forEach((inputElement) => {
            inputElement.addEventListener('input', InputTextAreaTag.handleInputChange);
        });
    }

    static handleInputChange(event) {
        //const parent_id =  "markedHTMLViewer";
        const edit_id = event.target.id;
        const view_id = edit_id + "_viewer";
        //console.log(view_id);
        const viewElement = document.getElementById(view_id);
        //viewElement.textContent = event.target.value;
        if (event.target.value.trim() === '') {
            viewElement.innerHTML = "Fill the Textarea input!";
        }
        else {
            InputTextAreaTag.mdToHTML(viewElement as HTMLDivElement, event.target.value);
        }

        //TextAreaUpdate.updated(event.target);
    }

    static mdToHTML(element: HTMLDivElement, md: string) {
        element.innerHTML = null;
        const parsedHtmlString = marked(md);
        const parser = new DOMParser();
        const doc = parser.parseFromString(parsedHtmlString, 'text/html');

        Array.from(doc.body.childNodes).forEach(node => {
            element.appendChild(node);
        });
    }
}

export default InputTextAreaTag;