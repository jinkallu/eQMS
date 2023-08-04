import DisplayTag from "./customtags/DisplayTag";
class MarkedAzureSDK {
  public async parseCustomTags(htmlDOM: Document): Promise<Document | null> {
    try {
      const displayTaskElements = Array.from(htmlDOM.querySelectorAll('displaywork'));

      if (displayTaskElements.length > 0) {
        const promises: Promise<HTMLElement | null>[] = [];

        for (const displayTaskElement of displayTaskElements) {
          const promise = DisplayTag.parse(displayTaskElement);
          promises.push(promise);
        }

        const newElements = await Promise.all(promises);

        newElements.forEach((newElement, index) => {
          const displayTaskElement = displayTaskElements[index];
          if (newElement) {
            displayTaskElement.parentNode?.replaceChild(newElement, displayTaskElement);
          }
        });
      } else {
        console.log('<displaywork> elements not found');
      }

      return htmlDOM;
    } catch (error) {
      console.error('Error parsing custom tags:', error);
      return null;
    }
  }
}

export default MarkedAzureSDK;
