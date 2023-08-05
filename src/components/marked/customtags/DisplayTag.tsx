import { WorkItemHelper } from "./WorkItemHelper";
import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";


class DisplayTag {
    static async parse(element: Element): Promise<HTMLElement | null> {
        try {
            const id = element.getAttribute('id');
            // handle id error!
            console.log(id);
            const work = await DisplayTag.loadWorkItem(id);
            const newElement = document.createElement('div');
            const table = this.createTable(work, element, id);
            // Append the table to the div
            newElement.appendChild(table);


            //newElement.textContent = 'work.fields["System.Title"]'; // Set the content of the new element
            // Replace <displaytasks> with the new element

            return newElement;

        }
        catch {
            return null;
        }
    }

    static createCellFromFields(work: WorkItem, field: string): HTMLElement {
        const cell = document.createElement('td');
        cell.style.border = '1px solid #000'; // Cell border
        cell.style.padding = '8px'; // Cell padding
        cell.innerHTML = work.fields[`System.${field}`];
        return cell;
    }

    static createCell(work: WorkItem, id: string): HTMLElement {
        const cell = document.createElement('td');
        cell.style.border = '1px solid #000'; // Cell border
        cell.style.padding = '8px'; // Cell padding
        cell.textContent = work.id.toString();
        return cell;
    }

    static createCellWithLink(work: WorkItem, id: string): HTMLElement {
        const cell = document.createElement('td');
        cell.style.border = '1px solid #000'; // Cell border
        cell.style.padding = '8px'; // Cell padding

        const link = document.createElement('a');
        link.href = work.url;
        link.textContent = work.id.toString();
        cell.appendChild(link);
        return cell;
    }

    static createTableHead(fieldsArray: string[]): HTMLElement{
        const headerRow = document.createElement('tr');
        for (const fieldValue of fieldsArray) {
            const columnHeader = document.createElement("th");
            columnHeader.style.border = '1px solid #000'; // Cell border
            columnHeader.style.padding = '8px'; // Cell padding
            columnHeader.textContent = fieldValue; // Set the text content for the header
            headerRow.appendChild(columnHeader); // Append the <th> to the <tr>
        }
        return headerRow; 
    }

    static createRow(work: WorkItem, fieldsArray: string[], id: string): HTMLElement {
        const row = document.createElement('tr');
        if(id){
            const cell = this.createCellWithLink(work, id);
            row.appendChild(cell);
        }
        for (const fieldValue of fieldsArray) {
            const cell = this.createCellFromFields(work, fieldValue);
            row.appendChild(cell);
        }
        return row;
    }

    static createTable(work: WorkItem, element: Element, id: string): HTMLElement {
        const fields = element.getAttribute('fields');
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse'; // Combine cell borders
        table.style.width = '100%'; // Set table width
        table.style.border = '1px solid #000'; // Table border

        if (fields) {
            const fieldsArray = fields.split(' ');
            const tableHead = document.createElement('thead');
            const headerRow = this.createTableHead(["Id", ...fieldsArray])
            tableHead.appendChild(headerRow);
            table.appendChild(tableHead);
            const row = this.createRow(work, fieldsArray, id);
            table.appendChild(row);
        } else {
        }

        return table;
    }

    static async loadWorkItem(id): Promise<WorkItem> {
        const workItemHelper = new WorkItemHelper();
        const workItem = await workItemHelper.loadWorkItem(id);
        return workItem;
    }

}

export default DisplayTag;
