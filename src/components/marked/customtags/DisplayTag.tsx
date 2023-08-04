import { WorkItemHelper } from "../WorkItemHelper";


class DisplayTag {
    static async parse(element: Element): Promise<HTMLElement | null> {
        try {
            // Get the value of the "type" attribute
            const id = element.getAttribute('id');
            const work = await DisplayTag.loadWorkItem(id);
            const newElement = document.createElement('div');
            newElement.textContent = work; // Set the content of the new element
            // Replace <displaytasks> with the new element

            return newElement;

        }
        catch{
            return null;
        }
    }

    static async loadWorkItem(id): Promise<string> {
        const workItemHelper = new WorkItemHelper();
        const workItemTitle = await workItemHelper.loadWorkItem(id);
        return workItemTitle;
    }

}

export default DisplayTag;
