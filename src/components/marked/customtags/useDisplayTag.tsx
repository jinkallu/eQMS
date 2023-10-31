import { WorkItemHelper } from "./WorkItemHelper";
import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";
import {register} from "../useMarkedAzureSDK";

const  useDisplayTag = () => {
    const registerCondition = () => {
        console.log("Calling register");
        register('displaywork', (element: Element, container_id: string) => {
            return parse(element, container_id);
        });
    }

    const parse = async (element: Element, container_id: string): Promise<HTMLElement | null> => {
        try {
            const newElement = document.createElement('div');
            newElement.id = container_id;

            const id = element.getAttribute('id');
            if (id !== null && id.trim() !== '') {
                const work = await loadWorkItem(id);

                const table = createTable(work, element, id);
                // Append the table to the div
                newElement.appendChild(table);
            }
            else {
                newElement.innerText = "Insert ID";
            }



            //newElement.textContent = 'work.fields["System.Title"]'; // Set the content of the new element
            // Replace <displaytasks> with the new element

            return newElement;

        }
        catch {
            return null;
        }
    }

    const createCellFromFields = (work: WorkItem, field: string): HTMLElement => {
        const cell = document.createElement('td');
        cell.style.border = '1px solid #000'; // Cell border
        cell.style.padding = '8px'; // Cell padding
        cell.innerHTML = work.fields[`System.${field}`];
        return cell;
    }

    const createCell = (work: WorkItem, id: string): HTMLElement => {
        const cell = document.createElement('td');
        cell.style.border = '1px solid #000'; // Cell border
        cell.style.padding = '8px'; // Cell padding
        cell.textContent = work.id.toString();
        return cell;
    }

    const createCellWithLink = (work: WorkItem, id: string): HTMLElement => {
        const cell = document.createElement('td');
        cell.style.border = '1px solid #000'; // Cell border
        cell.style.padding = '8px'; // Cell padding

        const link = document.createElement('a');
        link.href = work.url;
        link.textContent = work.id.toString();
        cell.appendChild(link);
        return cell;
    }

    const createTableHead = (fieldsArray: string[]): HTMLElement => {
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

    const createRow = (work: WorkItem, fieldsArray: string[], id: string): HTMLElement => {
        const row = document.createElement('tr');
        if (id) {
            const cell = createCellWithLink(work, id);
            row.appendChild(cell);
        }
        for (const fieldValue of fieldsArray) {
            const cell = createCellFromFields(work, fieldValue);
            row.appendChild(cell);
        }
        return row;
    }

    const createTable = (work: WorkItem, element: Element, id: string): HTMLElement => {
        const fields = element.getAttribute('fields');
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse'; // Combine cell borders
        table.style.width = '100%'; // Set table width
        table.style.border = '1px solid #000'; // Table border

        if (fields) {
            const fieldsArray = fields.split(' ');
            const tableHead = document.createElement('thead');
            const headerRow = createTableHead(["Id", ...fieldsArray])
            tableHead.appendChild(headerRow);
            table.appendChild(tableHead);
            const row = createRow(work, fieldsArray, id);
            table.appendChild(row);
        } else {
        }

        return table;
    }

    const loadWorkItem = async (id): Promise<WorkItem> => {
        const workItemHelper = new WorkItemHelper();
        const workItem = await workItemHelper.loadWorkItem(id);
        return workItem;
    }
    return {registerCondition, parse};
}

export default useDisplayTag;
