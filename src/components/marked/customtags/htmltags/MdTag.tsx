import MarkedAzureSDK from "../../MarkedAzureSDK";
import MdFunctions from "../MdFunctions";
import TextAreaUpdate from "../../TextAreaUpdate";


class MdTag {

    static register(){
        MdTag.registerCondition();
        MdTag.registerEvents();
    }

    static registerCondition() {
        MarkedAzureSDK.register('md', (element: Element, container_id: string) => {
            return MdTag.parse(element, container_id);
        });
    }

    static async parse(element: Element, container_id: string): Promise<HTMLElement | null> {
        return new Promise((resolve, reject) => {
            //console.log(element);
            let parentAttribute = element.getAttribute('level');
            if (parentAttribute === null) {
                parentAttribute = '0';
                element.setAttribute('level', parentAttribute);
            }
            if (parentAttribute === '0') {
                const mdElement = document.createElement('textarea');
                mdElement.rows = 10; 
                mdElement.style.width = "100%";   
                mdElement.placeholder = "Placeholder for Markdown text...";            
                mdElement.readOnly = true;
                mdElement.setAttribute('type', "md");
                //console.log(mdElement);
                resolve(mdElement);
            }
            else if (parentAttribute === '1') {
                const mdElement = document.createElement('textarea');
                mdElement.id = element.id + '_textarea';
                mdElement.rows = 10; 
                mdElement.style.width = "100%";   
                mdElement.value = element.getAttribute('mdstring');
                mdElement.setAttribute('type', "md");
                //console.log(element.getAttribute('mdstring'));

                //mdElement.placeholder = "Placeholder for Markdown text...";            
                //mdElement.readOnly = true;
                resolve(mdElement);
            }
            else {
                //const mdElement = document.createElement('textarea');
                //mdElement.rows = 10; 
                //mdElement.style.width = "100%";   
                //mdElement.value = element.getAttribute('mdstring');
                console.log(element);

                //mdElement.placeholder = "Placeholder for Markdown text...";            
                //mdElement.readOnly = true;
                resolve(element as HTMLElement);
            }
        });
    }

    static registerEvents(){
        const parentId = "Editor"; //TODO: get it from somewhere, not magic string 
        MdFunctions.register(parentId, (pId: string) => {
            return MdTag.registerMdTagTextAreaEvents(pId);
        });
    }

    static registerMdTagTextAreaEvents(parentid: string){
        const parentElement = document.getElementById(parentid);
        const textAreaElements = parentElement.querySelectorAll('textarea[type="md"]');
        console.log(textAreaElements);
        textAreaElements.forEach((textAreaElement) => {
            textAreaElement.addEventListener('input', MdTag.handleTextareaChange);
        });
    }

    static handleTextareaChange(event){
        TextAreaUpdate.updated(event.target);
    }
}

export default MdTag;