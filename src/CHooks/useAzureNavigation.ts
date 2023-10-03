import { useState } from "react";
import * as SDK from "azure-devops-extension-sdk";
import {
  CommonServiceIds,
  IHostNavigationService,
} from "azure-devops-extension-api";

const useAzureNavigation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const azureNavigate = async (url) => {
    setIsLoading(true);
    setError(null);

    try {
      const hostNavigationService =
        await SDK.getService<IHostNavigationService>(
          CommonServiceIds.HostNavigationService
        );
      await hostNavigationService.navigate(url);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { azureNavigate, isLoading, error };
};

export default useAzureNavigation;
