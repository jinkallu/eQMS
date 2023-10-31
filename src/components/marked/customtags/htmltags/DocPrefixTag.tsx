import MarkedAzureSDK from "../../useMarkedAzureSDK";

class DocPrefixTag {
    static registerCondition() {
        // MarkedAzureSDK.register('docprefix', (element: Element, container_id: string) => {
        //     return DocPrefixTag.parse(element, container_id);
        // });
    }

    static async parse(element: Element, container_id: string): Promise<HTMLElement | null> {
        return new Promise((resolve, reject) => {
                let parentAttribute = element.getAttribute('parent'); 
                if (parentAttribute === null) {
                    parentAttribute = '0';
                    element.setAttribute('parent', parentAttribute);
                }
                if(parentAttribute === '0'){
                    const spanElement = document.createElement('span');
                    spanElement.textContent = element.tagName;
                    spanElement.style.color = 'blue';
                    resolve(spanElement);
                }
                else if(parentAttribute === '1'){
                    const spanElement = document.createElement('span');
                    spanElement.textContent = "SOP"; // TODO: read the prefix from file name.
                    spanElement.style.color = 'black';
                    resolve(spanElement);
                }
        });
    }
}

export default DocPrefixTag;