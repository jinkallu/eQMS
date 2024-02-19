import { RWDataStorage } from "./RWDataStorage";
import { RWDocDataStorage } from "./RWDocDataStorage";

interface Child {
  id: string;
  name: string;
  type: string;
}

enum StateType {
  StateInit,
  StateIdle,
  StateEditBranchCreated,
  StateEdit,
  StateReview,
  StatePublish
}

interface Node {
  id?: string;
  parent_id: string;
  name: string;
  number: string;
  doc: boolean;
  type: string;
  repo_path: string;
  child_prefix: string;
  max_children: number;
  children: Child[];
  state: StateType;
}

export class QMSDataOps {
  qmsData: Node[];
  qmsProjectId: string;
  qmsKey: string;
  qmsRepoId: string;

  rwDataStorage: RWDataStorage;
  rwDocDataStorage: RWDocDataStorage;

  constructor() {
    this.qmsData = [];
    this.rwDataStorage = new RWDataStorage();
    this.rwDocDataStorage = new RWDocDataStorage();
    this.qmsKey = "";
  }

  public getNodes = () => {
    return this.qmsData;
  };

  public setQMSProjectId = (id: string) => {
    this.qmsProjectId = id;
  };

  public setQMSRepoName = (repoName: string) => {
    var qmsRepoName = repoName;
    //this.qmsRepoId =
  };

  public setQMSKey = (name: string) => {
    this.qmsKey = this.qmsProjectId + "_" + name;
    console.log(this.qmsKey);
  };

  public initNode = (
    id: string = "",
    parent_id: string = "",
    name: string = "QMS",
    number: string = "",
    doc: boolean = false,
    type: string = "",
    child_prefix: string = "",
    max_children: number = -1,
    repo_path: string = "",
    children: Child[] = [],
    state: StateType = StateType.StateInit
  ) => {
    const nod: Node = {
      ...(id !== "" ? { id } : {}), // Conditionally include the 'id' property
      parent_id,
      name,
      number,
      doc,
      type,
      repo_path,
      child_prefix,
      max_children,
      children,
      state
    };
    return nod;
  };

  public initQMS = (name = "QMS", id = "root", type = "qms") => {
    var nod = this.initNode(id, "", name, "", false, type, "", 2, "", []);
    return nod;
  };

  public updateLocalNode = (newItem: Node) => {
    const i_id = this.qmsData?.find((item) => item.id === newItem?.id)?.id;
    if (i_id) {
      this.qmsData[i_id] = newItem;
    } else {
      this.qmsData.push(newItem);
    }
  };

  public storeQMS = async (q: Node) => {
    try {
      console.log("Storing QMS data ", q);
      const res = await this.rwDataStorage.saveData(this.qmsKey, q);
      console.log("Stored QMS data ", res);
      return true;
    } catch (error) {
      console.log(error);
    }
  };

  public initStoreQMS = async (
    name: string = "QMS",
    id: string = "root",
    type = "qms"
  ) => {
    const q = this.initQMS(name);
    this.setQMSKey(type);
    var res = await this.storeQMS(q);
    if (res) {
      this.updateLocalNode(q);
    }
    
  };

  public readQMS = async () => {
    try {
      console.log("qmsKey ", this.qmsKey);

      const res = await this.rwDataStorage.readData(this.qmsKey);
      console.log("res ", res, this.qmsKey);
      return res;
    } catch (error) {
      return null;
    }
  };

  public readStoreQMS = async () => {
    try {
      const q: Node = await this.readQMS();
      if (q) {
        this.updateLocalNode(q);
        const childrenPromises = [];
        for (const child of q.children) {
          childrenPromises.push(this.readStoreQMSDoc(child.id, child.type));
        }
        await Promise.all(childrenPromises);
      }
      console.log(this.qmsData);
      return true;
    } catch (error) {
      return null;
    }
  };

  public readStoreQMSDoc = async (id: string, type: string) => {
    try {
      const q: Node = await this.rwDocDataStorage.readDocument(
        this.qmsProjectId + "_" + type,
        id
      );

      if (q) {
        this.updateLocalNode(q);
        const childrenPromises = [];
        for (const child of q.children) {
          childrenPromises.push(this.readStoreQMSDoc(child.id, child.type));
        }
        await Promise.all(childrenPromises);
      }
      console.log(this.qmsData);
      return true;
    } catch (error) {
      console.log("Error");
      return null;
    }
  };

  public findNode = (id) => {
    for (let i = 0; i < this.qmsData.length; i++) {
      if (this.qmsData[i].id === id) return i;
    }
    return -1;
  };

  public addChild = async (
    parent_id = "",
    name = "",
    number = "",
    doc = false,
    type = "",
    child_prefix = "",
    max_children = -1,
    repo_path = "",
    children = []
  ) => {
    const parentNode_index = this.findNode(parent_id);
    if (parentNode_index > -1) {
      const nameExists = this.qmsData[parentNode_index].children?.find(
        (item) => item.name === name
      )?.name;
      if (nameExists) {
        console.log(
          "Child name ",
          name,
          " already exists! Choose a different name."
        );
        return;
      }
      var newChild = this.initNode(
        "",
        parent_id,
        name,
        number,
        doc,
        type,
        child_prefix,
        max_children,
        repo_path,
        children
      );

      var nChild = await this.rwDocDataStorage.createDocument(
        this.qmsProjectId + "_" + type,
        newChild
      );
      console.log(nChild);

      this.qmsData[parentNode_index].children.push({
        id: nChild.id,
        name: nChild.name,
        type: nChild.type,
      }); // TODO: Check if the child exists already
      this.qmsData.push(nChild);
      if (this.qmsData[parentNode_index].parent_id === "") {
        this.storeQMS(this.qmsData[parentNode_index]);
      } else {
        console.log(
          this.qmsProjectId + "_" + this.qmsData[parentNode_index].type,
          this.qmsData[parentNode_index]
        );
        await this.rwDocDataStorage.updateDocument(
          this.qmsProjectId + "_" + this.qmsData[parentNode_index].type,
          this.qmsData[parentNode_index]
        );
      }
      return nChild;
    } else {
      console.log("Error! Could not find the parent with id ", parent_id);
    }
  };
}
