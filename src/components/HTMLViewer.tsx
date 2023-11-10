import MarkedHTMLViewer from "./marked/MarkedHTMLViewer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useExtnStore } from "../zustand/store";
import React from "react";
import { markedToHtml } from "../utils/markedHelper";
import { Box, Chip, CircularProgress, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import MarkedEditView from "./marked/MarkedEditView";
import MdFunctions from "./marked/customtags/MdFunctions";
import useCommit from "../CHooks/useCommit";
import EditConfModal from "./EditConfModal";
import useGetTeamMembers from "../CHooks/useGetTeamMembers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditorSave from "./marked/EditerSave";
import MonacoEditor from "./MonacoEditor";

export default function HTMLViewer() {
  //const { htmlContents, fileContentLoading, branchFileNames, setFileContent } =
  // useGetRepoDetails((state) => state);
  //console.log(htmlContents);

  //export default function HTMLViewer() {
  const {
    htmlContents,
    fileContentLoading,
    branchFileNames,
    getFileContent,
    repository,
  } = useExtnStore((state) => state);

  const project = useExtnStore((state) => state.project);

  const [inputText, setInputText] = React.useState("");
  const [html, setHtml] = React.useState<Document>();

  const [processFlowMain, setProcessFlowMain] = React.useState<{
    nodes: [];
    edges: [];
  }>({ nodes: [], edges: [] });

  const [branch, setBranch] = React.useState<any>();
  const [editMode, setEditMode] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [commitMessage, setCommitMessage] = React.useState("");
  const { commit, loading: loadingCommit } = useCommit();
  const setAlertMessage = useExtnStore((state) => state.setAlertMessage);
  const [state, setState] = React.useState({
    processFlow: { nodes: [], edges: [] },
  });
  const [searchParams] = useSearchParams();
  // const objectId = searchParams.get("objectId");
  const relativePath = searchParams.get("relativePath");
  const type = searchParams.get("type");
  const branchName = searchParams.get("branchName");
  const canEdit = searchParams.get("canEdit");
  const navigate = useNavigate();
  const {
    loading: loadingTeamMembres,
    getTeamMembers,
    getProjectTeams,
    getProjectTeamWithMembers,
  } = useGetTeamMembers();
  const { readDatabase } = useExtnStore();

  async function getProcessFlow(branchName) {
    const processFlowData = await getFileContent(
      repository.id,
      "qms/sop/processFlow.txt",
      branchName
    );
    if (processFlowData) {
      setProcessFlowMain(JSON.parse(processFlowData));
    }
    return;
  }

  async function getFileContentData() {
    // const branchData = branchFileNames?.find(
    //   (item) => item.objectId === objectId
    // );
    // setBranch(branchData);

    const content = await getFileContent(
      repository.id,
      `/qms/${type}/data.html`,
      branchName
    );
    getProcessFlow(branchName);
    setInputText(content);
  }

  async function getDatabaseContent(collectionName, repositoryId) {
    await readDatabase({ collectionName, repositoryId });
  }

  function handleClose() {
    setOpen(false);
  }

  async function saveContent(): Promise<boolean> {
    let path = [];
    let processFlowPathArr = [];

    let editBranchNameArr = branchName.split("/");
    path = [editBranchNameArr[0], type, `data.html`];
    processFlowPathArr = [editBranchNameArr[0], type, `processFlow.txt`];
    const filePath = path.join("/");
    const processFlowPath = processFlowPathArr.join("/");

    editBranchNameArr.splice(-1);
    editBranchNameArr.push("edit");
    const editBranchName = editBranchNameArr.join("/");

    // const md = EditorSave.findEditableMds(inputText, "Editor");

    const createdData = await commit(
      project.id,
      repository.id,
      editBranchName,
      filePath,
      html?.body?.innerHTML,
      commitMessage
    );

    const createdProcessFlow = await commit(
      project.id,
      repository.id,
      editBranchName,
      processFlowPath,
      JSON.stringify(state["processFlow"]),
      commitMessage
    );

    return createdData && createdProcessFlow;
    // if (created) {
    //   setAlertMessage({
    //     message: "Data saved successfully",
    //     severity: "success",
    //   });
    // } else {
    //   setAlertMessage({ message: "Unable to save data...", severity: "error" });
    // }
    // navigate(-1);
  }
  function toggleEditModeData() {
    setEditMode((prev) => !prev);
  }

  React.useEffect(() => {
    if (!editMode) getFileContentData();
  }, [editMode]);

  React.useEffect(() => {
    getDatabaseContent("standards", repository.id);
    const members = getTeamMembers("eQMS", "eQMS Team");

    // const members = getTeamMembers(project.name, project.name + " Team");
    // console.log(members);
    // const text = htmlContents[objectId];
    // console.log(htmlContents);
    // setInputText(text);
  }, [htmlContents]);
  if (fileContentLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress></CircularProgress>;
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {!editMode && (
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingX: "24px",
            height: "50px",
            position: "fixed",
            width: "100%",
            opacity: 1,
            zIndex: 100,
          }}
        >
          <ArrowBackIcon
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          ></ArrowBackIcon>

          <Chip label={relativePath} color="primary" variant="outlined"></Chip>
          <Box>
            {canEdit && editMode && (
              <SaveIcon onClick={() => setOpen(true)}></SaveIcon>
            )}
            <EditIcon
              onClick={toggleEditModeData}
              sx={{ cursor: "pointer" }}
            ></EditIcon>
          </Box>
        </Paper>
      )}
      <EditConfModal
        commitMessage={commitMessage}
        setOpen={setOpen}
        loading={loadingCommit}
        setCommitMessage={setCommitMessage}
        open={open}
        handleClose={handleClose}
        saveContent={saveContent}
      ></EditConfModal>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
        {editMode && (
          <MonacoEditor
            objectId={""}
            type={type}
            branchName={branchName}
            relativePath={relativePath}
            html={html}
            setHtml={setHtml}
            setOpenEditModal={setOpen}
            state={state}
            setState={setState}
          ></MonacoEditor>
        )}
        {!editMode && (
          <MarkedHTMLViewer
            markedText={inputText}
            ready={true}
            edit={false}
            html={html}
            setHtml={setHtml}
            processFlow={processFlowMain}
          />
        )}
      </Box>
    </Box>
  );
}
