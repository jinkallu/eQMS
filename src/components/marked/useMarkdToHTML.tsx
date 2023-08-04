import { marked } from 'marked'; // Import marked without curly braces
import { useState } from 'react';

import MarkedAzureSDK from './MarkedAzureSDK';

function useMarkdToHTML() {
    const [loadingHTML, setLoadingHTML] = useState(false);

    const markedAzureSDK = new MarkedAzureSDK();


    const parseMarkdownToHTMLString = (markdownText: string) => {
        const parsedHtmlString = marked(markdownText);
        return parsedHtmlString;
    };

    const parseHTMLStringToDOM = (parsedHtmlString: string): Document => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(parsedHtmlString, 'text/html');
        return doc;
    };

    const parseDOMCustomTags = async (htmlDOM: Document): Promise<Document | null> => {
        try {
          const result = await markedAzureSDK.parseCustomTags(htmlDOM);
          if (result !== null) {
            return result;
          } else {
            console.error('An error occurred while parsing custom tags.');
            return null;
          }
        } catch (error) {
          console.error('An error occurred:', error);
          return null;
        }
      };
      

    const addToParentElement = (childHTMLDOM: Document, parentNodeId: string) => {
        const existingDiv = document.getElementById(parentNodeId);//'markedHTMLViewer');
        if (!existingDiv) {
            console.error(`Parent node with ID ${parentNodeId} not found.`);
            return;
        }
        existingDiv.innerHTML = '';
        Array.from(childHTMLDOM.body.childNodes).forEach(node => {
            existingDiv.appendChild(node.cloneNode(true));
        });
    };

    const markdToCustom = (markdown: string, parentNodeId: string) => {
        const htmlString: string = parseMarkdownToHTMLString(markdown);
        const htmlDOM: Document = parseHTMLStringToDOM(htmlString);
        //const htmlDOMCustom = parseDOMCustomTags(htmlDOM);
        parseDOMCustomTags(htmlDOM).then(htmlDOMCustom => {
            if (htmlDOMCustom !== null) {
              // Now you can work with htmlDOMCustom
              addToParentElement(htmlDOMCustom, parentNodeId)
            }
          });
    }

    return {
        loadingHTML,
        markdToCustom
    };
}

export default useMarkdToHTML;