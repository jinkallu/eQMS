import MarkedHTMLViewer from "./marked/MarkedHTMLViewer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useExtnStore } from "../zustand/store";
import React from "react";
import { markedToHtml } from "../utils/markedHelper";
import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import MarkedEditView from "./marked/MarkedEditView";
import useCommit from "../CHooks/useCommit";
import EditConfModal from "./EditConfModal";
import useGetTeamMembers from "../CHooks/useGetTeamMembers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function HTMLViewer() {
  const {
    htmlContents,
    fileContentLoading,
    branchFileNames,
    setFileContent,
    repository,
  } = useExtnStore((state) => state);

  const project = useExtnStore((state) => state.project);

  const [inputText, setInputText] = React.useState("");
  const [branch, setBranch] = React.useState<any>();
  const [editMode, setEditMode] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [commitMessage, setCommitMessage] = React.useState("");
  const { commit, loading: loadingCommit } = useCommit();
  const setAlertMessage = useExtnStore((state) => state.setAlertMessage);
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
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
  async function getFileContent(objectId) {
    const branchData = branchFileNames?.find(
      (item) => item.objectId === objectId
    );
    setBranch(branchData);

    await setFileContent(
      repository.id,
      `/qms/${branchData.type}/${branchData.relativePath}/${branchData.relativePath}.md`,
      branchData.name,
      branchData.objectId
    );
  }

  async function getDatabaseContent(collectionName, repositoryId) {
    await readDatabase({ collectionName, repositoryId });
  }

  function handleClose() {
    setOpen(false);
  }

  async function saveContent(): Promise<boolean> {
    let path = [];

    let editBranchNameArr = branchName.split("/");
    path = [editBranchNameArr[0], type, relativePath, `${relativePath}.md`];
    const filePath = path.join("/");

    editBranchNameArr.splice(-1);
    editBranchNameArr.push("edit");
    const editBranchName = editBranchNameArr.join("/");

    const created = await commit(
      project.id,
      repository.id,
      editBranchName,
      filePath,
      inputText,
      commitMessage
    );

    console.log(created);

    return created;
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
    if (!editMode) getFileContent(objectId);
  }, [objectId, editMode]);

  React.useEffect(() => {
    console.log(project);

    getDatabaseContent("standards", repository.id);
    const members = getTeamMembers("eQMS", "eQMS Team");

    // const members = getTeamMembers(project.name, project.name + " Team");
    // console.log(members);
    const text = htmlContents[objectId];
    setInputText(text);
  }, [objectId, htmlContents]);
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
        maxHeight: "100vh",
        overflowY: "scroll",
        paddingTop: "9px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingX: "24px",
        }}
      >
        <ArrowBackIcon
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        ></ArrowBackIcon>
        <EditConfModal
          commitMessage={commitMessage}
          setOpen={setOpen}
          loading={loadingCommit}
          setCommitMessage={setCommitMessage}
          open={open}
          handleClose={handleClose}
          saveContent={saveContent}
        ></EditConfModal>
        <Chip
          label={branch?.relativePath?.split("-")?.slice(1)?.join(" ")}
          color="primary"
          variant="outlined"
        ></Chip>
        <Box>
          {canEdit && editMode && (
            <SaveIcon onClick={() => setOpen(true)}></SaveIcon>
          )}
          <EditIcon
            onClick={toggleEditModeData}
            sx={{ cursor: "pointer" }}
          ></EditIcon>
        </Box>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {editMode && (
          <MarkedEditView
            inputText={inputText}
            setInputText={setInputText}
            objectId={objectId}
            type={type}
            branchName={branchName}
            relativePath={relativePath}
          ></MarkedEditView>
        )}
        {!editMode && (
          <MarkedHTMLViewer inputText={inputText}></MarkedHTMLViewer>
        )}
      </Box>
    </Box>
  );
}
