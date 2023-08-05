import { marked } from 'marked';
import MarkedAzureSDK from './MarkedAzureSDK';
const markedAzureSDK = new MarkedAzureSDK();

const DisplayTasksRenderer = new marked.Renderer();


// Function that wraps the loadWorkItemWithTimeout function with synchronous return
// Function that wraps the loadWorkItemWithTimeout function with synchronous return
let promiseResolved = false;
let promiseResult = "Not yet";
let startTime;
function loadWorkItemSynchronously(html) {
    if (/<(displaytasks)(\s|>)/.test(html)) {
        
      //return `<div style="background-color: red; padding: 10px">${promiseResult}</div>`;
      console.log(html);
      return ``;
    } 
    
      return html;
    
  }
  
  
  // Assign the loadWorkItemSynchronously function to the html property of the custom renderer
  DisplayTasksRenderer.html = loadWorkItemSynchronously;
  
export default DisplayTasksRenderer;
