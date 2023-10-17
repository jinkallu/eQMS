import MarkedAzureSDK from "../../useMarkedAzureSDK";

class DocNumberTag {
    static registerCondition() {
        MarkedAzureSDK.register('docnumber', (element: Element, container_id: string) => {
            return DocNumberTag.parse(element, container_id);
        });
    }

    static async parse(element: Element, container_id: string): Promise<HTMLElement | null> {
        return new Promise((resolve, reject) => {
                let parentAttribute = element.getAttribute('parent'); 
                if (parentAttribute === null) {
                    parentAttribute = '0';
                    element.setAttribute('parent', parentAttribute);
                }
                if(parentAttribute === '0'){
                    const divElement = document.createElement('span');
                    divElement.textContent = element.tagName;
                    divElement.style.color = 'blue';
                    resolve(divElement);
                }
        });
    }
}

export default DocNumberTag;