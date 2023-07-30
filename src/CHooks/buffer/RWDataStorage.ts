import * as SDK from "azure-devops-extension-sdk";
import {
    CommonServiceIds,
    IExtensionDataService,
} from "azure-devops-extension-api";

export class RWDataStorage {
    private dataManager: any;

    constructor() {
        this.dataManager = null;
        this.initDataManager();
    }

    public async initDataManager(){
        try {
            const accessToken = await SDK.getAccessToken();
            const extDataService = await SDK.getService<IExtensionDataService>(
                CommonServiceIds.ExtensionDataService
            );

            this.dataManager = await extDataService.getExtensionDataManager(
                SDK.getExtensionContext().id,
                accessToken
            );
            
        } catch (err) {
            console.log("Error :", err);
        } 
    }

    public async saveData(key: string, value: any): Promise<any> {
        try {
            console.log("key value to store ", key, value);
            const res = await this.dataManager.setValue(key, value);
            return true;
        } catch (err) {
            console.log("Error :", err);
            return false;
        } finally {
        }
    }

    public async readData(key: string): Promise<any> {
        try {
            const value = await this.dataManager.getValue(key);
            return value;
        } catch (err) {
        } finally {
        }
        return null;
    };
}

