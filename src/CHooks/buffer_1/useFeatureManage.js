import { useState } from "react";
import { getClient } from "azure-devops-extension-api";
import { FeatureManagementRestClient } from "azure-devops-extension-api/FeatureManagement"


const useFeatureManage = () => {

    function disableFeatures(projectId) {
        const featureIds = [
            "ms.vss-work.agile",
            "ms.vss-code.version-control",
            "ms.vss-build.pipelines",
            "ms.vss-test-web.test",
            "ms.feed.feed"
        ]

        for(let i = 0; i < featureIds.length; i++){
            disableFeature(featureIds[i], projectId);
        }
    }

    async function disableFeature(featureId, projectId) {
        try {

            const featureManagementClient = getClient(FeatureManagementRestClient);
            // Define the parameters for setting the feature state
            //const featureId = "ms.vss-code.version-control"; // Example feature ID
            const userScope = "host"; // Use "host" for all users
            const scopeName = "project"; // Scope name (e.g., "project" or "team")
            const scopeValue = projectId; // Project ID where you want to set the feature state
            const reason = "Disabling Boards"; // Reason for changing the state
            const reasonCode = "456"; // Reason code

            // Create a ContributedFeatureState object with the desired state (set to false to disable the feature)
            const featureState = {
                featureId: featureId,
                state: false
            };
            const features = featureManagementClient.setFeatureStateForScope(featureState, featureId, userScope, scopeName, scopeValue, reason, reasonCode)

        } catch (error) {
            console.error("Error disabling Features:", error.message);
        }
    }


    return { disableFeatures };
};

export default useFeatureManage;
