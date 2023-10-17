import MarkedAzureSDK from "../../useMarkedAzureSDK";
import MdFunctions from "../MdFunctions";
class DocLogoTag {
    static registerCondition() {
        MarkedAzureSDK.register('doclogo', (element: Element, container_id: string) => {
            return DocLogoTag.parse(element, container_id);
        });
    }

    

    static async parse(element: Element, container_id: string): Promise<HTMLElement | null> {
        return new Promise((resolve, reject) => {
            let parentAttribute = element.getAttribute('parent');
            if (parentAttribute === null) {
                parentAttribute = '0';
                element.setAttribute('parent', parentAttribute);
            }
            if (parentAttribute === '0') {
                const imgElement = document.createElement('img');
                imgElement.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wAAAgAB/4g8JAAAAABJRU5ErkJggg==";
                imgElement.alt = "Placeholder Image";
                if (element instanceof HTMLElement) {
                    if(element.style.width){
                        imgElement.style.width = element.style.width;
                    }
                    if(element.style.height){
                        imgElement.style.height = element.style.height;
                    }
                }
                imgElement.style.border = "2px solid blue"; 

                resolve(imgElement);
            }
            else if (parentAttribute === '1') {
                const fileElement = document.createElement('input');
                //imgElement.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wAAAgAB/4g8JAAAAABJRU5ErkJggg==";
                //imgElement.alt = "Placeholder Image";
                if (element instanceof HTMLElement) {
                    if(element.style.width){
                        fileElement.style.width = element.style.width;
                    }
                    if(element.style.height){
                        fileElement.style.height = element.style.height;
                    }
                }
                //fileElement.style.border = "2px solid blue"; 
                fileElement.type = "file";
                //fileElement.addEventListener('change', MdFunctions.handleFileSelect);
                fileElement.addEventListener('change', (event) => {
                    // Add debug output to check if the event handler is called
                    console.log("File input change event", event);
                
                    // Call the MdFunctions handleFileSelect function
                    //MdFunctions.handleFileSelect(event);
                });
                resolve(fileElement);
            }
        });
    }
}

export default DocLogoTag;