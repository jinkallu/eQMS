import { useState } from 'react';
import * as SDK from "azure-devops-extension-sdk"
import { CommonServiceIds, IExtensionDataService } from 'azure-devops-extension-api';


const useRWDocDataStorage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const createDocument = async (collection, newDoc) => {
        setIsLoading(true);
        setError(null);

        try {
            const accessToken = await SDK.getAccessToken();
            const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);

            const dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);
            //await dataManager.setValue(key, value);
            // Prepare document first
            

            const doc = await dataManager.createDocument(collection, newDoc)
            // Even if no ID was passed to createDocument, one gets generated
            setData(doc);
            return doc;
            
            console.log("Doc id: " + doc.id);


        } catch (err) {
            console.log('Retrieved value:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const saveData = async (key, value) => {
        setIsLoading(true);
        setError(null);

        try {
            const accessToken = await SDK.getAccessToken();
            const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);

            const dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);
            //await dataManager.setValue(key, value);
            // Prepare document first
            var newDoc = {
                fullScreen: false,
                screenWidth: 500
            };

            const doc = await dataManager.createDocument("MyCollection", newDoc)
            // Even if no ID was passed to createDocument, one gets generated
            
            console.log("Doc id: " + doc.id);
            return doc;

        } catch (err) {
            console.log('Retrieved value:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const readDocument = async (collection, docId) => {
        setIsLoading(true);
        setError(null);

        try {
            const accessToken = await SDK.getAccessToken();
            const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);

            const dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);
            const doc = await dataManager.getDocument(collection, docId);
            console.log('Value:', doc);
            setData(doc);


        } catch (err) {
            console.log('Retrieved value:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const readDocumentByKeyValue = async (collection, key, value) => {
        setIsLoading(true);
        setError(null);

        try {
            const accessToken = await SDK.getAccessToken();
            const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);

            const dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);
            const docs = await dataManager.getDocuments(collection);
            const doc = docs.find((d) => d[key] === value);
            console.log('Value:', doc);
            setData(doc);
            return doc;

        } catch (err) {
            console.log('Retrieved value:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateDocument = async (collection, docNew) => {
        setIsLoading(true);
        setError(null);

        try {
            const accessToken = await SDK.getAccessToken();
            const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);

            const dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);
            const doc = await dataManager.updateDocument(collection, docNew);
            console.log('Value:', doc);
            setData(doc);
            return doc;

        } catch (err) {
            console.log('Retrieved value:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteDocument = async (collection, docId) => {
        setIsLoading(true);
        setError(null);

        try {
            const accessToken = await SDK.getAccessToken();
            const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);

            const dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);
            const doc = await dataManager.deleteDocument(collection, docId);
            setData(doc);


        } catch (err) {
            console.log('Retrieved value:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };


    return { createDocument, saveData, readDocument, readDocumentByKeyValue, updateDocument,deleteDocument, data, isLoading, error };
};

export default useRWDocDataStorage;
