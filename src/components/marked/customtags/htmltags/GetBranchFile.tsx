import { getClient } from "azure-devops-extension-api";
import { GitRestClient } from 'azure-devops-extension-api/Git';

export class GetBranchFile {
    constructor() {
    }

    static async getFile(repositoryId: string, branchName: string, filePath: string) {
        try {
            const gitRestClient = getClient(GitRestClient);
            const versionDescriptor = { version: branchName, versionOptions: null, versionType: 0 };
            const file = await gitRestClient.getItemContent(repositoryId, filePath, repositoryId, null, null, false, false, false, versionDescriptor);
            return file;
        }
        catch (error) {
            console.error("Error:", error);
            return null;
        }
    }
}
