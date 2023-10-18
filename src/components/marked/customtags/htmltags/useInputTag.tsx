import { register } from "../../useMarkedAzureSDK";
import MdFunctions from "../MdFunctions";

/*interface MyComponentProps {
    level: string; // Define your custom attribute here
}*/

const useInputTag = () => {

    const registerAllInputTags = () => {
        registerCondition();
        registerEvents();
    }

    const registerCondition = () => {
        register('input', (element: Element, container_id: string, type: number) => {
            return parse(element, container_id, type);
        });
    }

    const parse = async (element: Element, container_id: string, type: number): Promise<React.ReactElement | null> => {
        return new Promise((resolve, reject) => {
            console.log(container_id, type);
            element.id = container_id;
            let inputLevelAttribute = element.getAttribute('inputlevel');

            const TestHTMLElement= ({ id, level }) => {
                return (
                    <input id={id} data-level={level} value="Hi"></input>
                )
            }

            if (inputLevelAttribute === null || inputLevelAttribute === '') {
                inputLevelAttribute = '0';
                element.setAttribute('inputlevel', inputLevelAttribute);
            }

            if (type === 0) { // Editor
                if (inputLevelAttribute === '0') {
                    (element as HTMLInputElement).disabled = true;
                    resolve(<TestHTMLElement id={element.id} level={10} />);
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
                        if (attributeName === "value") {
                            spanElement.textContent = attributeValue;
                        }
                        else {
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

    const registerEvents = () => {
        const parentId = "HTMLEditor"; //TODO: get it from somewhere, not magic string 
        MdFunctions.register(parentId, (pId: string) => {
            return registerInputTagEvents(pId);
        });
    }

    const registerInputTagEvents = (parentid: string) => {
        const parentElement = document.getElementById(parentid);
        const inputElements = parentElement.querySelectorAll('input');
        console.log(inputElements);
        inputElements.forEach((inputElement) => {
            inputElement.addEventListener('input', handleInputChange);
        });
    }

    const handleInputChange = (event) => {
        //const parent_id =  "markedHTMLViewer";
        const edit_id = event.target.id;
        const view_id = edit_id + "_viewer";
        console.log(view_id);
        const viewElement = document.getElementById(view_id);
        console.log(viewElement, event.target.value)
        viewElement.textContent = event.target.value;

        //TextAreaUpdate.updated(event.target);
    }

    return { registerAllInputTags };
}

export default useInputTag;