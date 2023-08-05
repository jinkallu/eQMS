import DisplayTag from "./customtags/DisplayTag";
import DiagramTag from "./customtags/mxgraphtags/DiagramTag";
class MarkedAzureSDK {
  public async parseCustomTags(htmlDOM: Document): Promise<Document | null> {
    try {
      const promises_displayTaskElements: Promise<HTMLElement | null>[] = [];
      const displayTaskElements = Array.from(htmlDOM.querySelectorAll('displaywork'));

      if (displayTaskElements.length > 0) {
        
        for (const displayTaskElement of displayTaskElements) {
          const promise = DisplayTag.parse(displayTaskElement);
          promises_displayTaskElements.push(promise);
        }
      }

      const promises_diagramElements: Promise<HTMLElement | null>[] = [];
      const diagramElements = Array.from(htmlDOM.querySelectorAll('diagram'));

      if (diagramElements.length > 0) {
        console.log('found diagram')
        var id = 0;
        for (const diagramElement of diagramElements) {
          //const newElement = document.createElement('div');
          //newElement.id = `diagram_${id}`;
          id+=1;
          //diagramElement.parentNode?.replaceChild(newElement, diagramElement);
          const promise = DiagramTag.parse(diagramElement, `diagram_${id}`);
          promises_diagramElements.push(promise);
        }
      }

      if (displayTaskElements.length > 0) {
        console.log('found displaywork')

        const newElements = await Promise.all(promises_displayTaskElements);

        newElements.forEach((newElement, index) => {
          const displayTaskElement = displayTaskElements[index];
          if (newElement) {
            displayTaskElement.parentNode?.replaceChild(newElement, displayTaskElement);
          }
        });
      } 
      if (diagramElements.length > 0) {
        const newElements = await Promise.all(promises_diagramElements);

        newElements.forEach((newElement, index) => {
          const diagramElement = diagramElements[index];
          if (newElement) {
            diagramElement.parentNode?.replaceChild(newElement, diagramElement);
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
