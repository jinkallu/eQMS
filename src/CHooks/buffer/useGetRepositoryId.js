import { useState, useEffect } from "react";
import { getClient } from "azure-devops-extension-api/Common";
import { GitRestClient } from "azure-devops-extension-api/Git";

const useGetRepositoryId = () => {
  const [loading, setLoading] = useState(false);
  const [repoId, setRepoId] = useState(null);

  const getRepositoryId = async (projectId, repoName) => {
    console.log("getreposit called");
    setLoading(true);
    try {
      const gitClient = getClient(GitRestClient);
      const repositories = await gitClient.getRepositories(projectId);
      console.log(repositories);

      const repo = repositories.find(
        (repository) => repository.name === repoName
      );
      console.log("repo", repo);

      if (repo) {
        setRepoId(repo.id);
        return repo.id;
      }
    } catch (error) {
      console.error("Error fetching repository ID:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { getRepositoryId, loading, repoId };
};

export default useGetRepositoryId;
