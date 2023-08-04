import { WorkItemTrackingRestClient } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient";
import { getClient } from "azure-devops-extension-api/Common/Client";


export class WorkItemHelper {
    constructor(){

    }
    public async loadWorkItem(workItemId): Promise<string> {
        const witClient = getClient(WorkItemTrackingRestClient);
        const workItem  = await witClient.getWorkItem(workItemId, undefined, undefined);

        // Retrieve the work item name from the response object
        //console.log("Work item name: " + workItem.fields["System.Title"]);
        return workItem.fields["System.Title"];
    }

}
