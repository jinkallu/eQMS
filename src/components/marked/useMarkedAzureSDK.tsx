//import DisplayTag from "./customtags/DisplayTag";
//import DiagramTag from "./customtags/mxgraphtags/DiagramTag";
import { useState, useEffect } from "react";
import CytoscapeTags from "./customtags/cytoscapetags/CytoscapeTags";
import { v4 as uuidv4 } from 'uuid';

import useCustomTags from "./customtags/useCustomTags";
import {createPortal} from "react-dom";

const callbacks: { condition: string, callback: (element: Element, container_id: string, type: number) => any }[] = [];

export function register(condition: string, callback: (element: Element, container_id: string, type: number) => any) {
  callbacks.push({ condition, callback });
  console.log(condition);
}


const useMarkedAzureSDK = () => {
  const [promises, setPromises] = useState<Promise<React.ReactElement | null>[]>([]);
  const [elements, setElements] = useState<Element[]>([]);
  //const [htmlDOM, setHtmlDOM] = useState<Document>();

  const {registerCustomTags} = useCustomTags();

  const registerAllCustomTags = () => {
    registerCustomTags();
  }

  const checkConditionsAndInvokeCallbacks = async (htmlDOM: Document, type: number, parentId: string) => {
    console.log("Called checkConditionsAndInvokeCallbacks");
    for (const item of callbacks) {
      //console.log(MarkedAzureSDK.callbacks);
      console.log(item.condition, htmlDOM);
      const elements = Array.from(htmlDOM.querySelectorAll(item.condition));
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
              if (item.condition === "textarea") {
                condition = 'textarea[type="input"]';
              }
              else {
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
            if (type === 2) {
              id = element.id + "_viewer";
            }
            else {
              id = element.id;
            }

          }

          const promise = item.callback(element, id, type);
          const promisesCopy = [...promises];
          promisesCopy.push(promise);
          setPromises(promisesCopy);

          const elementsCopy = [...elements];
          elementsCopy.push(element);
          setElements(elementsCopy);
        }
      }
    }
  }





  const parseCustomTags = async (htmlDOM: Document, type: number, parentId: string): Promise<Document | null> => {
    //this.promises.length = 0;
    setPromises([]);
    setElements([]);
    //setHtmlDOM(null);

    //setHtmlDOM(htmlDOM);

    try {
      
      //this.htmlDOM = htmlDOM;
      checkConditionsAndInvokeCallbacks(htmlDOM, type, parentId);
      //this.displayWork();
      //this.diagram();
      //this.process();
      //this.processFlow();

      if (promises.length > 0) {

        const newElements = await Promise.all(promises);

        newElements.forEach((newElement, index) => {
          const element = elements[index];
          console.log(newElement);
          if (newElement) {
            //element.parentNode?.replaceChild(newElement, element);
            createPortal(newElement, document.body);
          }
        });
      }

      return htmlDOM;
    } catch (error) {
      console.error('Error parsing custom tags:', error);
      return null;
    }
  }

  useEffect(() => {

  }, [])

  return {registerAllCustomTags, parseCustomTags};
}

export default useMarkedAzureSDK;
