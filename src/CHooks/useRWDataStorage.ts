import { useState } from "react";
import * as SDK from "azure-devops-extension-sdk";
import {
  CommonServiceIds,
  IExtensionDataService,
} from "azure-devops-extension-api";

const useRWDataStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const saveData = async (key, value) => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await SDK.getAccessToken();
      const extDataService = await SDK.getService<IExtensionDataService>(
        CommonServiceIds.ExtensionDataService
      );

      const dataManager = await extDataService.getExtensionDataManager(
        SDK.getExtensionContext().id,
        accessToken
      );
      console.log("ke value to store ", key, value);
      const res = await dataManager.setValue(key, value);
      return true;
    } catch (err) {
      console.log("Error :", err);
      setError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const readData = async (key) => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await SDK.getAccessToken();
      const extDataService = await SDK.getService<IExtensionDataService>(
        CommonServiceIds.ExtensionDataService
      );

      const dataManager = await extDataService.getExtensionDataManager(
        SDK.getExtensionContext().id,
        accessToken
      );
      const value = await dataManager.getValue(key);
      console.log(value);
      setData(value);
      return value;
    } catch (err) {
      console.log("Retrieved value:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  return { saveData, readData, data, isLoading, error };
};

export default useRWDataStorage;
