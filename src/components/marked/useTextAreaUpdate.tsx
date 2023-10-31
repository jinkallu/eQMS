import { marked } from 'marked'; // Import marked without curly braces
import useMarkedAzureSDK from './useMarkedAzureSDK';
import MdFunctions from './customtags/MdFunctions';


const useTextAreaUpdate = () => {

  const {parseCustomTags} = useMarkedAzureSDK();

  const updated = async (textarea: HTMLTextAreaElement) => {
    const md = textarea.value;
    const parsedHtmlString = marked(md);
    const parser = new DOMParser();
    const doc = parser.parseFromString(parsedHtmlString, 'text/html');
    //let markedAzureSDK = new MarkedAzureSDK();
    parseCustomTags(doc, 1, "").then(result => {
      if (result !== null) {
        //console.log(textarea.id);
        const parentid = textarea.id.replace(/_textarea$/, "_div");
        //console.log(parentid);
        addToParentElement(result, parentid, "HTMLEditor");
        MdFunctions.implmentEvents('HTMLEditor')
      }
      //markedAzureSDK = null;

      const parser_2 = new DOMParser();
      const doc_2 = parser_2.parseFromString(parsedHtmlString, 'text/html');
      //let htmlDocument = document.implementation.createHTMLDocument();
      //const htmlEditor = document.getElementById("HTMLEditor");
      //const pid = textarea.id.replace(/_textarea$/, "_div");
      //const childElement = htmlEditor.querySelector(`#${pid}`);

      //Array.from(childElement.childNodes).forEach(node => {
      //  htmlDocument.body.appendChild(node.cloneNode(true));
      //});
      //console.log(htmlDocument);
      //let markedAzureSDK_2 = new MarkedAzureSDK();
      const parentid = textarea.id.replace(/_textarea$/, "_div");

      parseCustomTags(doc_2, 2, parentid).then(result => {
        if (result !== null) {
          //console.log(textarea.id);
          //console.log(parentid);
          addToParentElement(result, parentid, "markedHTMLViewer");
        }
        //markedAzureSDK_2 = null;
        //htmlDocument = null;
      });
    });

  }

  const addToParentElement = (childHTMLDOM: Document, parentNodeId: string, parent: string) => {
    //console.log(childHTMLDOM, parent, parentNodeId);
    const parentDiv = document.getElementById(parent);
    const existingDiv = parentDiv.querySelector(`#${parentNodeId}`);
    //console.log(existingDiv);
    if (!existingDiv) {
      console.error(`Parent node with ID ${parentNodeId} not found.`);
      return;
    }
    existingDiv.innerHTML = '';
    Array.from(childHTMLDOM.body.childNodes).forEach(node => {
      //console.log(node);
      existingDiv.appendChild(node);
    });
  };

  return {updated};
}

export default useTextAreaUpdate;