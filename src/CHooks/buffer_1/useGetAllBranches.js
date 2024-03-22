import { useState, useEffect } from "react";
import { getClient } from "azure-devops-extension-api/Common";
import { GitRestClient } from "azure-devops-extension-api/Git";

const useGetAllBranches = () => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState(null);

  const getBranches = async (repositoryId) => {
    console.log("getall braches called");
    setLoading(true);
    try {
      const gitClient = getClient(GitRestClient);
      const branches = await gitClient.getBranches(repositoryId);
      console.log("branches");
      console.log(branches);
    } catch (error) {
      console.error("Error fetching repository ID:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { getBranches, loading };
};

export default useGetAllBranches;
