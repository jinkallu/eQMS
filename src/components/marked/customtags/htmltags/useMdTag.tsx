import {register} from "../../useMarkedAzureSDK";
import MdFunctions from "../MdFunctions";
import useTextAreaUpdate from "../../useTextAreaUpdate";


const useMdTag = () => {

    //const {updated} = useTextAreaUpdate();

    const registerAllMdTags = () => {
        registerCondition();
        registerEvents();
    }

    const registerCondition = () => {
        console.log("Registering MdTags");
        register('md', (element: Element, container_id: string) => {
            return parse(element, container_id);
        });
    }

    const parse = async (element: Element, container_id: string): Promise<HTMLElement | null> => {
        return new Promise((resolve, reject) => {
            console.log("Parsing ", element);
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

    const registerEvents = () => {
        const parentId = "Editor"; //TODO: get it from somewhere, not magic string 
        MdFunctions.register(parentId, (pId: string) => {
            return registerMdTagTextAreaEvents(pId);
        });
    }

    const registerMdTagTextAreaEvents = (parentid: string) => {
        const parentElement = document.getElementById(parentid);
        const textAreaElements = parentElement.querySelectorAll('textarea[type="md"]');
        console.log(textAreaElements);
        textAreaElements.forEach((textAreaElement) => {
            textAreaElement.addEventListener('input', handleTextareaChange);
        });
    }

    const handleTextareaChange = (event) => {
        //updated(event.target);
    }

    return {registerAllMdTags};
}

export default useMdTag;