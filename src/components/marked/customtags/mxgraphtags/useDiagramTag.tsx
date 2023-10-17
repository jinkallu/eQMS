import Diagram from './diagram';
import {register} from '../../useMarkedAzureSDK';

const useDiagramTag = () => {
  const registerCondition = () => {
    register('diagram', (element: Element, container_id: string) => {
      return parse(element, container_id);
    });

    register('process', (element: Element, container_id: string) => {
      return parse(element, container_id);
    });
}

  const initializeMxGraph = async (element: Element, container_id: string): Promise<HTMLElement | null> => {
    const container = document.createElement('div');
    container.id = container_id;
    if (!container) {
      console.log(container_id, 'not available');
      return null;
    }


    const diagram = new Diagram();
    const tag = element.tagName.toLowerCase();
    if(tag === 'diagram'){
      diagram.loadAndDisplayGraph(container);
    }
    else if(tag === 'process'){
      diagram.processflow(element, container);
    }
    else{
      console.log(tag, 'not supported');
    }

    return container;
  }

  const parse = async (element: Element, newElement_id: string): Promise<HTMLElement | null> => {
    try {
      // Get the value of the "type" attribute
      //const id = element.getAttribute('id');
      const newElement = initializeMxGraph(element, newElement_id);
      
      //const newElement = document.createElement('div');
      //newElement.textContent = work; // Set the content of the new element
      // Replace <displaytasks> with the new element

      return newElement;

    }
    catch {
      return null;
    }
  }
}

export default useDiagramTag;

