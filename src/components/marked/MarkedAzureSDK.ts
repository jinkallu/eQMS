//import DisplayTag from "./customtags/DisplayTag";
//import DiagramTag from "./customtags/mxgraphtags/DiagramTag";
import CytoscapeTags from "./customtags/cytoscapetags/CytoscapeTags";
import { v4 as uuidv4 } from 'uuid';


import CustomTags from "./customtags/CustomTags"
class MarkedAzureSDK {
  private static callbacks: { condition: string, callback: (element: Element, container_id: string, type: number) => any }[] = [];

  static register(condition: string, callback: (element: Element, container_id: string, type: number) => any) {
    MarkedAzureSDK.callbacks.push({ condition, callback });
    console.log(condition);
  }

  private promises: Promise<HTMLElement | null>[] = [];
  private elements: Element[] = [];
  private htmlDOM: Document;

  constructor() {
    CustomTags.registerCustomTags();
  }

  async checkConditionsAndInvokeCallbacks(type: number, parentId: string) {
    console.log("Called checkConditionsAndInvokeCallbacks");
    for (const item of MarkedAzureSDK.callbacks) {
      //console.log(MarkedAzureSDK.callbacks);
      //console.log(item.condition, this.htmlDOM);
      const elements = Array.from(this.htmlDOM.querySelectorAll(item.condition));
      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          //console.log(element.id);
          let id = null;
          if (element.id.trim() === '') {
            if (type === 2 && parentId !== "" && item.condition !== "md") {
              // look for the corresponding entry in HTMLEditor / its textarea and copy the id.
              //console.log(parentId);
              const elementEditor = document.getElementById(parentId);
              //console.log(elementEditor);
              let condition = null;
              if(item.condition === "textarea"){
                condition = 'textarea[type="input"]';
              }
              else{
                condition = item.condition;
              }
              var children = elementEditor.querySelectorAll(condition);
              //console.log(children);
              id = children[i].id + "_viewer";

            }
            else {
              const uuid = uuidv4();
              id = item.condition + "_" + uuid;
            }
          }
          else {
            if (type === 2){
              id = element.id + "_viewer";
            }
            else{
              id = element.id;
            }
            
          }

          const promise = item.callback(element, id, type);
          this.promises.push(promise);
          this.elements.push(element);
        }
      }
    }
  }

 

  

  public async parseCustomTags(htmlDOM: Document, type: number, parentId: string): Promise<Document | null> {
    this.promises.length = 0;
    this.elements.length = 0;
    this.htmlDOM = null;

    try {
      this.htmlDOM = htmlDOM;
      this.checkConditionsAndInvokeCallbacks(type, parentId);
      //this.displayWork();
      //this.diagram();
      //this.process();
      //this.processFlow();

      if (this.promises.length > 0) {

        const newElements = await Promise.all(this.promises);

        newElements.forEach((newElement, index) => {
          const element = this.elements[index];
          if (newElement) {
            element.parentNode?.replaceChild(newElement, element);
          }
        });
      }

      return htmlDOM;
    } catch (error) {
      console.error('Error parsing custom tags:', error);
      return null;
    }
  }
}

export default MarkedAzureSDK;
