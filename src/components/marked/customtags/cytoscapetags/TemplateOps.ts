import { useState, useEffect } from "react";
import { getClient } from "azure-devops-extension-api";
import { GitRestClient } from 'azure-devops-extension-api/Git';
import { marked } from 'marked'; 

class TemplateOps {
    static async templateExists(repositoryId: string, branchName: string, filePath: string){
        try {
            const gitRestClient = getClient(GitRestClient);
            const versionDescriptor = { version: branchName, versionOptions: null, versionType: 0 };
            const item = await gitRestClient.getItem(repositoryId, filePath, repositoryId, null, null, false, false, false, versionDescriptor);             
            const fileExists = item?true: false;
            return fileExists;
        } catch (error) {
            console.error("Error:", error);
            return null;
        } finally {
        }
    };

    static async templateFieldExists(repositoryId: string, branchName: string, filePath: string, id: string){
        try {
            const gitRestClient = getClient(GitRestClient);
            const versionDescriptor = { version: branchName, versionOptions: null, versionType: 0 };
            const itemText = await gitRestClient.getItemText(repositoryId, filePath, repositoryId, null, null, false, false, false, versionDescriptor);             
            const parsedHtmlString = marked(itemText);
            const parser = new DOMParser();
            const doc = parser.parseFromString(parsedHtmlString, 'text/html');
            const element = doc.getElementById(id);
            if(element){
                return true;
            }
            else{
                return false;
            }
        } catch (error) {
            console.error("Error:", error);
            return null;
        } finally {
        }
    };
};

export default TemplateOps;