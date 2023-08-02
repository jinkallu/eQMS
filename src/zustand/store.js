import { create } from "zustand";

import { getClient } from "azure-devops-extension-api/Common";
import { GitRestClient } from "azure-devops-extension-api/Git";

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
  setRepository: async (projectId, repoName) => {
    try {
      const gitClient = getClient(GitRestClient);
      const repositories = await gitClient.getRepositories(projectId);

      const repo = repositories.find(
        (repository) => repository.name === repoName
      );

      if (repo) {
        console.log(repo);
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
      console.log(branches);
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
      console.log(typeBranchData);
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
  setFileContent: async (repositoryId, path, branchName) => {
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
      console.log(content);
    } catch (e) {
      console.log(e);
    }
  },

  setFileContenttobedel: async (projectId, repositoryId, filePath, branch) => {
    console.log(`refs/heads/${branch}`);
    const versionDescriptor = {
      version: "qms/qm/6d54415a-f9bb-46cb-9c09-23fe4f9b2bde/main",
      version: "qms/sop/93877a50-dde5-4d69-bd40-4e4883be1701/main",
      versionType: 0,
    };
    try {
      // TODO wrong call, correct it
      const gitClient = getClient(GitRestClient);

      // const content2 = await gitClient.getItemText(
      //   repositoryId,
      //   // "qms/qm/Quality-Manual/Quality-Manual.md",
      //   null,
      //   null, // project
      //   "/qms/qm/Quality-Manual/Quality-Manual.md", // scopepath
      //   null, // recursionLevel
      //   undefined, // includeContentMetadata,
      //   undefined, // latestProcessedChange
      //   false, // download

      //   versionDescriptor
      //   //{ versionDescriptor: { version: `refs/heads/${branch}`, versionType: 0 } }
      // );

      // console.log(content2);

      const content1 = await gitClient.getItem(
        repositoryId,
        "/qms/sop",

        null, // project
        null, // scopepath
        0, // recursionLevel
        undefined, // includeContentMetadata,
        undefined, // latestProcessedChange
        false, // download

        versionDescriptor
        //{ versionDescriptor: { version: `refs/heads/${branch}`, versionType: 0 } }
      );
      console.log(content1);

      const content = await gitClient.getTree(
        repositoryId,
        // "20f3904f97359c57a2e68da299fcbad88889f61b",
        content1.objectId,
        // "0ff63d2a961777b59f8ace4e1b2081f428fb9c59",
        null,
        undefined, // scopepath
        true, // recursionLevel
        undefined // includeContentMetadata,
        // true, // latestProcessedChange
        // false, // download
        // versionDescriptor
        //{ versionDescriptor: { version: `refs/heads/${branch}`, versionType: 0 } }
      );
      console.log(content);
      //content = await fileResponse.text();
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  },
}));
