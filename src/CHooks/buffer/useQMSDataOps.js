import { useState, useEffect } from "react";
import { QMSDataOps } from "./QMSDataOps";
import useCreateBranch from "../useCreateBranch";
import useGetRepositoryId from "./useGetRepositoryId";
//import dataStructure from "../../config/settings";
import useCommit from "./useCommit";

const qmsDataOps = new QMSDataOps();


const useQMSDataOps = (settingsData) => {
  console.log(settingsData);
  const [qmsData, setQMSData] = useState([]); // init with empty array
  const [qmsProjectId, setQMSProjectId] = useState(null);
  const [qmsRepoName, setQMSRepoName] = useState(null);
  const [qmsRepoId, setQMSRepoId] = useState(null);

  const { createBranch, loadingCreateBranch } = useCreateBranch();
  const { getRepositoryId, loadingRepoId } = useGetRepositoryId();
  
  const { renameFile } = useCommit();

  const initQMSProjectId = async (id, repoName, key = "qms") => {
    qmsDataOps.setQMSProjectId(id);
    qmsDataOps.setQMSKey(key);

    setQMSProjectId(id);
    setQMSRepoName(repoName);
    const repoId = await getRepositoryId(id, repoName);
    setQMSRepoId(repoId);
  };

  const addNode = async ({
    parent_id,
    name,
    number,
    doc,
    type,
    child_prefix,
    max_children,
    repo_path,
    children,
  }) => {
    console.log(parent_id, name, number, type);
    const nChild = await qmsDataOps.addChild(
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
    setQMSData([...qmsDataOps.getNodes()]);
    // TODO: check if the add child was succesfull
    console.log(nChild);
    const branchName = "qms/" + type + "/" + nChild.id + "/main";
    console.log(qmsProjectId, qmsRepoId, branchName);
    await createBranch(qmsProjectId, qmsRepoId, "main", branchName);
    //TODO: check the status
    let newPath = name;
    if (number) {
      newPath = number + '-' + newPath;
      if (type) newPath = type + '-' + newPath;
    }
    const file_name = newPath + ".md";
    newPath = "qms/" + type + "/" + newPath + "/" + file_name;

    newPath = "/" + newPath;
    newPath = newPath.replace(/ /g, "-");

    await renameFile(qmsProjectId, qmsRepoId, branchName, "/README.md", newPath, "rename default README.md file");
  };

  const initStoreQMS = async (name = "QMS", id = "root") => {
    console.log(settingsData);
    await qmsDataOps.initStoreQMS(name, id);
    const parent = settingsData?.find((item) => item.parent === null);
    settingsData
      ?.filter((data) => data.parent === parent.type && parent.createChild)
      ?.map((item) => {
        addNode({
          parent_id: id,
          name: item.name,
          number: "",
          doc: item.doc,
          type: item.type,
          child_prefix: item.type.toUpperCase(),
          max_children: item.max_children,
          rep_path: "",
          children: [],
        });
      });
    setQMSData([...qmsDataOps.getNodes()]);
  };

  const readStoreQMS = async () => {
    await qmsDataOps.readStoreQMS();
    console.log([...qmsDataOps.getNodes()]);

    setQMSData([...qmsDataOps.getNodes()]);
  };

  useEffect(() => {
    console.log("use qmsProjectId ", qmsProjectId);
  }, [qmsProjectId]);

  // useEffect(() => {
  //     console.log("use qms ", qmsData);
  //     setQMSData(qmsDataOps.getNodes());
  // }, []);

  useEffect(() => {
    console.log("use qms ", qmsData);
  }, [qmsData]);

  return {
    qmsData,
    qmsProjectId,
    qmsRepoId,
    initStoreQMS,
    initQMSProjectId,
    addNode,
    readStoreQMS,
  };
};

export default useQMSDataOps;
