import { WorkItemTrackingRestClient } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient";
import { WorkItem } from "azure-devops-extension-api/WorkItemTracking";
import { getClient } from "azure-devops-extension-api/Common/Client";

export class WorkItemHelper {
    constructor(){

    }
    public async loadWorkItem(workItemId): Promise<WorkItem> {
        const witClient = getClient(WorkItemTrackingRestClient);
        const workItem  = await witClient.getWorkItem(workItemId, undefined, undefined);

        // Retrieve the work item name from the response object
        //return workItem.fields["System.Title"];
        return workItem;
    }

}
