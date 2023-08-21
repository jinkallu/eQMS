import { getClient } from "azure-devops-extension-api/Common";
import { GitRestClient } from "azure-devops-extension-api/Git";
import { createBranch, getFileContent } from "../utils/gitHelpers";
export const dynamicIslandSlice = (set) => ({
  open: false,
  messageDIsland: "",
  defaultMessage: "Org Hub",
  temporary: true,
  setMessage: ({ showAlert, messageDIsland, temporary }) =>
    set((state) => ({ open: showAlert, messageDIsland, temporary })),

  setDefaultMessage: (defaultMessage) =>
    set((state) => ({ defaultMessage, messageDIsland: "", open: false })),
});

export const alertSnackbarSlice = (set) => ({
  openAlertSnackbar: false,
  message: "",
  severity: "info",
  setAlertMessage: ({ message, severity }) =>
    set((state) => ({ openAlertSnackbar: true, message, severity })),
  resetMessage: () =>
    set((state) => ({ openAlertSnackbar: false, message: "" })),
});

export const projectSlice = (set) => ({
  project: {},
  setProject: (project) => set((state) => ({ project })),
});

export const repositorySlice = (set, get) => ({
  repository: {},
  types: ["qm", "sop", "prod", "temp", "database"],
  branchTypes: {},
  branches: [],
  branchFileNames: [],
  htmlContents: {},
  fileContentLoading: false,
  fetchEditBranch: { loading: false, message: "", error: false },
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

  getObjectId: async (repositoryId, type) => {
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
      return item?.objectId;
    } catch (e) {
      return;
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
              ...state.branchFileNames.filter(
                (fileName) => fileName.objectId !== item.objectId
              ),
              {
                type,
                relativePath,
                name: branchName,
                objectId: item?.objectId,
                repositoryId,
              },
            ],
          }));
        }
      }
      return item.objectId;
    } catch (e) {
      return;
    }
  },
  setFileContent: async (repositoryId, path, branchName, objectId) => {
    set((state) => ({ fileContentLoading: true }));
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
      // const html = await markedToHtml(content);
      const newRes = { [objectId]: content };
      set((state) => ({
        fileContentLoading: false,
        htmlContents: { ...state.htmlContents, ...newRes },
      }));
    } catch (e) {
      console.log(e);
      const newRes = { objectId: "" };

      set((state) => ({
        fileContentLoading: false,
        htmlContents: { ...state.htmlContents, ...newRes },
      }));
    }
  },
  getEditBranch: async ({
    objectId,
    branchName,
    type,
    relativePath,
    repositoryId,
    projectId,
  }) => {
    let created = false;

    console.log(relativePath);
    let path = "";

    let editBranchName = branchName.split("/");
    path = [editBranchName[0], type, relativePath, `${relativePath}.md`];
    path = path.join("/");

    editBranchName.splice(-1);
    console.log(editBranchName);
    editBranchName.push("edit");
    editBranchName = editBranchName.join("/");

    console.log("editbranchname", editBranchName);
    set({ fetchEditBranch: { loading: true, message: "", error: false } });
    try {
      // check whether edit branch exists....
      const gitClient = getClient(GitRestClient);
      set((state) => ({
        fetchEditBranch: {
          ...state.fetchEditBranch,
          message: "Checking branch details...",
        },
      }));

      const branches = await gitClient.getBranches(repositoryId);
      set((state) => ({ branches: branches || [] }));

      const editBranch = branches?.find((branch) => {
        console.log(branch);
        const nameArray = branch.name.split("/");
        return (
          nameArray[1] === type &&
          nameArray[2] === branchName.split("/")[2] &&
          nameArray[3] === "edit"
        );
      });
      console.log(editBranch, branchName);
      if (editBranch) {
        set((state) => ({
          fetchEditBranch: {
            ...state.fetchEditBranch,
            message: "Branch found, fetching details....",
          },
        }));

        console.log("edit branch exists", editBranch, created);
        const data = await getFileContent(repositoryId, path, editBranchName);
        set((state) => ({
          fetchEditBranch: {
            ...state.fetchEditBranch,
            loading: false,
            message: "",
          },
        }));
        return data;
      } else {
        set((state) => ({
          fetchEditBranch: {
            ...state.fetchEditBranch,
            message: "Branch not found, creating new ...",
          },
        }));

        // edit branch doesnt exists.. create edit branch..

        // create new branch name

        created = await createBranch({
          projectId,
          repositoryId,
          baseBranch: branchName,
          newBranch: editBranchName,
        });

        if (created) {
          set((state) => ({
            fetchEditBranch: {
              ...state.fetchEditBranch,
              message: "Branch created successfully, fetching content...",
            },
          }));
          console.log(created);

          const data = await getFileContent(repositoryId, path, editBranchName);
          return data;
        } else {
          set((state) => ({
            fetchEditBranch: {
              ...state.fetchEditBranch,
              loading: false,
              message: "Unable to create branch...",
              error: true,
            },
          }));
        }
        console.log("edit branch doesnt exist", created);
      }
    } catch (e) {
      console.log(e);
      set({
        fetchEditBranch: {
          loading: false,
          message: "Some error occured",
          error: true,
        },
      });
      return false;
    }
  },
});

export const databaseSlice = (set, get) => ({
  standards: [],

  loadStandards: async () => {
    try {
      const path = `standards.json`;

      console.log(repositoryId, path, "qms/database/main");
      const json = await getFileContent(
        repositoryId,
        path,
        "qms/database/main"
      );
      set((state) => ({ standards: json }));
    } catch (e) {
      set((state) => ({ standards: [] }));
      console.log(e);
    }
  },

  readDatabase: async ({ collectionName, repositoryId }) => {
    console.log(collectionName, repositoryId);
    try {
      const path = `${collectionName}.json`;

      console.log(repositoryId, path, "qms/database/main");
      const json = await getFileContent(
        repositoryId,
        path,
        "qms/database/main"
      );
      const newData = {};
      newData[collectionName] = json;
      set((state) => ({ database: { ...state.database, newData } }));
      return json;
    } catch (e) {
      console.log("error");
      console.log(e);
      return null;
    }
  },

  updateDatabase: async ({ collectionName, repositoryId, data }) => {
    try {
    } catch (e) {}
  },
});
