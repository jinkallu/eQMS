import Diagram from './diagram'; // Import the ES6 class
                     // <- import values from factory()

class DiagramTag {
  static async initializeMxGraph(container_id: string): Promise<HTMLElement | null> {
    const container = document.createElement('div');
    container.id = container_id;
    if (!container) {
      console.log(container_id, 'not available');
      return null;
    }

    const diagram = new Diagram();
    diagram.loadAndDisplayGraph(container);

    return container;
  }

  static async parse(element: Element, newElement_id: string): Promise<HTMLElement | null> {
    try {
      // Get the value of the "type" attribute
      //const id = element.getAttribute('id');
      const newElement = this.initializeMxGraph(newElement_id);
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

export default DiagramTag;

