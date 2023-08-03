import { create } from "zustand";

import { getClient } from "azure-devops-extension-api/Common";
import { GitRestClient } from "azure-devops-extension-api/Git";
import { markedToHtml } from "../utils/markedHelper";
export const useDynamicIsland = create((set) => ({
  open: false,
  message: "",
  severity: "",
  defaultMessage: "Org Hub",
  temporary: true,
  setMessage: ({ showAlert, message, severity, temporary }) =>
    set((state) => ({ open, message, severity, temporary })),

  setDefaultMessage: (defaultMessage) =>
    set((state) => ({ defaultMessage, message: "", open: false })),
}));

export const useProject = create((set) => ({
  project: {},
  setProject: (project) => set((state) => ({ project })),
}));

export const useGetRepoDetails = create((set, get) => ({
  repository: {},
  types: ["qm", "sop", "prod", "temp", "database"],
  branchTypes: {},
  branches: [],
  branchFileNames: [],
  htmlContents: {},
  setRepository: async (projectId, repoName) => {
    try {
      const gitClient = getClient(GitRestClient);
      const repositories = await gitClient.getRepositories(projectId);

      const repo = repositories.find(
        (repository) => repository.name === repoName
      );

      if (repo) {
        set((state) => ({ repository: repo }));
      }
    } catch (error) {
      console.error("Error fetching repository ID:", error);
      set((state) => ({ repository: {} }));
    }
  },

  setBranches: async (repositoryId) => {
    try {
      const gitClient = getClient(GitRestClient);
      const branches = await gitClient.getBranches(repositoryId);
      set((state) => ({ branches: branches || [] }));
      const newBranchTypes = [];
      const typeBranchData = {};
      get().types?.map((type) => {
        typeBranchData[type] =
          branches
            ?.filter((branch) => {
              const nameArray = branch.name.split("/");
              return nameArray[1] === type && nameArray[3] === "main";
            })
            ?.map((item) => ({ name: item.name })) || [];
      });
      set((state) => ({ branchTypes: typeBranchData }));
    } catch (error) {
      console.error("Error fetching repository ID:", error);
      set((state) => ({ branches: [] }));
    }
  },

  setFileNames: async (repositoryId, branchName, type) => {
    const versionDescriptor = {
      version: branchName,
      versionType: 0,
    };
    try {
      const gitClient = getClient(GitRestClient);

      const item = await gitClient.getItem(
        repositoryId,
        `/qms/${type}`,
        null, // project
        null, // scopepath
        0, // recursionLevel
        undefined, // includeContentMetadata,
        undefined, // latestProcessedChange
        false, // download
        versionDescriptor
      );
      if (item) {
        const tree = await gitClient.getTree(
          repositoryId,
          item.objectId,
          null,
          undefined, // scopepath
          true, // recursionLevel
          undefined // includeContentMetadata,
        );
        if (tree) {
          const treeEntries = tree?.treeEntries;
          const relativePath = treeEntries?.find(
            (entry) => entry.gitObjectType === 2
          )?.relativePath;
          set((state) => ({
            branchFileNames: [
              ...state.branchFileNames,
              {
                type,
                relativePath,
                name: branchName,
                objectId: item?.objectId,
              },
            ],
          }));
        }
      }
    } catch (e) {}
  },
  setFileContent: async (repositoryId, path, branchName, objectId) => {
    const versionDescriptor = {
      version: branchName,
      versionType: 0,
    };
    try {
      const gitClient = getClient(GitRestClient);

      const content = await gitClient.getItemText(
        repositoryId,
        path,
        null,
        undefined, // scopepath
        undefined, // recursionLevel
        undefined, // includeContentMetadata,
        true, // latestProcessedChange
        false, // download
        versionDescriptor
      );
      const html = await markedToHtml(content);
      const newRes = { [objectId]: html };
      set((state) => ({ htmlContents: { ...state.htmlContents, ...newRes } }));
    } catch (e) {
      console.log(e);
      const newRes = { objectId: "" };

      set((state) => ({ htmlContents: { ...state.htmlContents, ...newRes } }));
    }
  },
}));
