import * as SDK from "azure-devops-extension-sdk"
import { CommonServiceIds, IExtensionDataService } from 'azure-devops-extension-api';


export class RWDocDataStorage {
    private dataManager:any;

    constructor(){
        this.dataManager = null;
        this.initDataManager();
    }

    public async initDataManager(){
        try {
            const accessToken = await SDK.getAccessToken();
            const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);

            this.dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);
        } catch (err) {
            console.log('Retrieved ', err);
        }
    }

    public async createDocument (collection:string, newDoc:any):Promise<any>{
        try {
            const doc = await this.dataManager.createDocument(collection, newDoc)
            return doc;
        } catch (err) {
            console.log('Retrieve:', err);
        }
    }


    public async readDocument (collection:string, docId:string): Promise<any>{
        try {
            const doc = await this.dataManager.getDocument(collection, docId);
            return doc;
        } catch (err) {
            console.log('Retrieve:', err);
        }
    };

    public async readDocumentByKeyValue (collection:string, key:string, value:any):Promise<any>{
        try {
            const docs = await this.dataManager.getDocuments(collection);
            const doc = docs.find((d:any) => d[key] === value);
            console.log('Value:', doc);
            return doc;

        } catch (err) {
            console.log('Retrieved value:', err);
        } 
    };

    public async updateDocument (collection:string, docNew:any){
        try {
            const doc = await this.dataManager.updateDocument(collection, docNew);
            return doc;
        } catch (err) {
            console.log('Retrieved value:', err);
        }
    };

    public async deleteDocument (collection:string, docId:string){
        try {
        
            const doc = await this.dataManager.deleteDocument(collection, docId);
            // TODO: return something

        } catch (err) {
            console.log('Retrieved value:', err);
        } 
    };
}
