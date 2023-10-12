import { getClient } from "azure-devops-extension-api/Common";
import { GitRestClient } from "azure-devops-extension-api/Git";
import { CoreRestClient } from "azure-devops-extension-api/Core";

import {
  commit,
  createBranch,
  getFileContent,
  getProjectPullRequests,
} from "../utils/gitHelpers";
import * as SDK from "azure-devops-extension-sdk";

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

export const userSlice = (set) => ({
  currentUser: {},
  isQualityMgrSelected: false,

  setQualityMgrRole: (val) => {
    set({ isQualityMgrSelected: val });
  },
  setCurrentUser: async () => {
    const user = await SDK.getUser();
    if (user) {
      set({ currentUser: user });
    }
  },
});

export const projectSlice = (set) => ({
  project: {},
  setProject: (project) => set((state) => ({ project })),
});

export const repositorySlice = (set, get) => ({
  repository: {},
  types: ["qm", "sop", "prod", "temp", "database", "rec"],
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
              return (
                nameArray[1] === type &&
                nameArray[nameArray?.length - 1] === "main"
              );
            })
            ?.map((item) => {
              const nameArray = item.name.split("/");

              return {
                name: item.name,
                branchId: nameArray[nameArray?.length - 2],
              };
            }) || [];
      });

      console.log(typeBranchData);

      set((state) => ({ branchTypes: typeBranchData }));
    } catch (error) {
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

  setFileNames: async (repositoryId, branchId, branchName, type) => {
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
                branchId,
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
      const newRes = { objectId: "" };

      set((state) => ({
        fileContentLoading: false,
        htmlContents: { ...state.htmlContents, ...newRes },
      }));
    }
  },

  getFileContent: async (repositoryId, path, branchName, objectId) => {
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
      return content;
    } catch (e) {
      return;
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

    let path = "";

    let editBranchName = branchName.split("/");
    path = [editBranchName[0], type, relativePath, `${relativePath}.md`];
    path = path.join("/");

    editBranchName.splice(-1);
    editBranchName.push("edit");
    editBranchName = editBranchName.join("/");

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
        const nameArray = branch.name.split("/");
        return (
          nameArray[1] === type &&
          nameArray[2] === branchName.split("/")[2] &&
          nameArray[3] === "edit"
        );
      });
      if (editBranch) {
        set((state) => ({
          fetchEditBranch: {
            ...state.fetchEditBranch,
            message: "Branch found, fetching details....",
          },
        }));

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
  sops: [],
  products: [],
  loadSOPs: async (repositoryId) => {
    try {
      const path = `sops.json`;
      const json = await getFileContent(
        repositoryId,
        path,
        "qms/database/main"
      );

      set({ sops: JSON.parse(json) });
    } catch (e) {
      set((state) => ({ sops: [] }));
    }
  },
  loadProducts: async (repositoryId) => {
    try {
      const path = `products.json`;
      const json = await getFileContent(
        repositoryId,
        path,
        "qms/database/main"
      );

      set({ products: JSON.parse(json) });
    } catch (e) {
      set((state) => ({ products: [] }));
    }
  },

  readDatabase: async ({ collectionName, repositoryId }) => {
    try {
      const path = `${collectionName}.json`;

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
      console.log(e);
      return null;
    }
  },

  saveToDatabase: async ({
    collectionName,
    projectId,
    repositoryId,
    newContent,
    commitMessage,
  }) => {
    const branchName = "qms/database/main";
    const filePath = `${collectionName}.json`;
    const res = await commit({
      projectId,
      repositoryId,
      branchName,
      filePath,
      newContent,
      commitMessage,
    });
    return res;
  },
  updateDatabase: async ({ collectionName, repositoryId, data }) => {
    try {
    } catch (e) {}
  },
});
export const teamsSlice = (set, get) => ({
  teamsWithMembers: [],
  isQualityManager: false,

  getProjectTeamWithMembers: async (projectId) => {
    try {
      const coreClient = getClient(CoreRestClient);
      const teams = await coreClient.getTeams(projectId);

      const teamsWithMembersData = await Promise.all(
        teams.map(async (team) => {
          const members = await coreClient.getTeamMembersWithExtendedProperties(
            projectId,
            team.id
          );
          return { ...team, members };
        })
      );
      // const teamsWithMembers = get().teamsWithMembers;
      const currentUserId = get()?.currentUser?.id;
      const isQmanager =
        teamsWithMembersData
          ?.find((team) => team?.name === "Quality Manager Team")
          ?.members?.filter((mem) => mem?.identity?.id === currentUserId)
          ?.length > 0;

      set({ isQualityManager: isQmanager });
      set({ teamsWithMembers: teamsWithMembersData });
    } catch (e) {
      console.log(e);
      set({ teamsWithMembers: [] });
    }
  },
});

export const pullRequestSlice = (set, get) => ({
  pullRequests: [],
  loadProjectPullRequests: async (projectId, searchCriteria) => {
    try {
      const result = await getProjectPullRequests(projectId, searchCriteria);
      if (result) {
        set({ pullRequests: result });
      } else {
        set({ pullRequests: [] });
      }
    } catch (e) {
      set({ pullRequests: [] });
    }
  },
});

export const refreshDataSlice = (set, get) => ({
  userSOPs: [],
  userProducts: [],
  refreshSOPDBData: async (projectId, projectName, repositoryId) => {
    if (!repositoryId) return;

    await get().setBranches(repositoryId);

    await get().getProjectTeamWithMembers(projectId);
    await get().loadSOPs(repositoryId);
    await get().loadProjectPullRequests(projectId, { repositoryId });

    // const userTeams = teamsWithMembers?.map((team) => team);
    const sops = get().sops;
    const allTeams = get().teamsWithMembers;
    const branchFileNames = get().branchFileNames;
    const pullRequests = get().pullRequests;
    const branchTypes = get()?.branchTypes;

    const sopsWithPullRequests = branchTypes["sop"]?.map((sop) => {
      const pullRequest = pullRequests?.find(
        (item) => item?.targetRefName?.split("/")[4] === sop.branchId
      );
      if (pullRequest) {
        return { ...sop, pullRequest };
      }
      return sop;
    });

    const userTeams = allTeams
      ?.filter((team) =>
        team?.members?.filter(
          (mem) => mem?.identity?.id === get()?.currentUser?.id
        )
      )
      ?.map((item) => item?.id);

    const qualityManager = userTeams?.find(
      (item) => item.name === "Quality Manager Team"
    );

    const userSOPs = sopsWithPullRequests?.map((sop) => {
      const authorData =
        sops?.find((item) => item.branchId === sop?.branchId)?.author || [];
      const author = [...new Set(authorData, userTeams)];
      const approverData =
        sops?.find((item) => item.branchId === sop?.branchId)?.approver || [];

      const approver = [...new Set(approverData, userTeams)];

      const templates =
        sops?.find((item) => item.branchId === sop?.branchId)?.templates || [];

      // const obj = branchFileNames?.find(
      //   (item) => item.branchId === sop.branchId
      // );

      return {
        ...sop,
        author,
        approver,
        templates,
        // objectId: obj?.objectId,
        // relativePath: obj?.relativePath,
        type: obj?.type,
        branchName: sop?.branchName,
      };
    });

    console.log(userSOPs);

    set({ userSOPs });
  },

  refreshProductDBData: async (projectId, projectName, repositoryId) => {
    if (!repositoryId) return;

    await get().setBranches(repositoryId);

    await get().getProjectTeamWithMembers(projectId);
    await get().loadProducts(repositoryId);

    const products = get().products;
    const allTeams = get().teamsWithMembers;
    const branchFileNames = get().branchFileNames;

    const userTeams = allTeams
      ?.filter((team) =>
        team?.members?.filter(
          (mem) => mem?.identity?.id === get()?.currentUser?.id
        )
      )
      ?.map((item) => item?.id);

    const userProducts = products
      ?.map((product) => {
        const author = [...new Set(product?.author, userTeams)];
        const approver = [...new Set(product?.approver, userTeams)];
        const reader = [...new Set(product?.reader, userTeams)];

        const obj = branchFileNames?.find(
          (item) => item.branchId === product.branchId
        );

        return {
          ...product,
          author,
          approver,
          reader,
          objectId: obj?.objectId,
          relativePath: obj?.relativePath,
          type: obj?.type,
          branchName: obj?.branchName,
        };
      })
      ?.filter(
        (item) =>
          item?.reader?.length > 0 ||
          item?.author?.length > 0 ||
          (item?.approver?.length > 0 && objectId)
      );

    set({ userProducts });
  },
});
