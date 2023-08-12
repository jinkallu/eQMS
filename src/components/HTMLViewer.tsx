import MarkedHTMLViewer from "./marked/MarkedHTMLViewer";
import { useSearchParams } from "react-router-dom";
import {
  useGetRepoDetails,
  useProject,
  useAlertSnackbar,
} from "../zustand/store";
import React from "react";
import { markedToHtml } from "../utils/markedHelper";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import MarkedEditView from "./marked/MarkedEditView";
import useCommit from "../CHooks/useCommit";
import EditConfModal from "./EditConfModal";

export default function HTMLViewer() {
  const {
    htmlContents,
    fileContentLoading,
    branchFileNames,
    setFileContent,
    repository,
  } = useGetRepoDetails((state) => state);

  const project = useProject((state) => state.project);

  const [inputText, setInputText] = React.useState<string>("");
  const [prevText, setPrevText] = React.useState<string>("");
  const [branch, setBranch] = React.useState<any>();
  const [editMode, setEditMode] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [commitMessage, setCommitMessage] = React.useState("");
  const { commit, loading: loadingCommit } = useCommit();
  const setMessage = useAlertSnackbar((state) => state.setMessage);
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const relativePath = searchParams.get("relativePath");
  const type = searchParams.get("type");
  const branchName = searchParams.get("branchName");

  async function getFileContent(objectId) {
    const branchData = branchFileNames?.find(
      (item) => item.objectId === objectId
    );
    setBranch(branchData);

    await setFileContent(
      branchData.repositoryId,
      `/qms/${branchData.type}/${branchData.relativePath}/${branchData.relativePath}.md`,
      branchData.name,
      branchData.objectId
    );
  }

  function handleClose() {
    setOpen(false);
  }

  function setInputTextfun(val) {
    setInputText(val);
  }

  async function saveContent() {
    setOpen(false);
    let path = [];

    let editBranchNameArr = branchName.split("/");
    path = [editBranchNameArr[0], type, relativePath, `${relativePath}.md`];
    const filePath = path.join("/");

    editBranchNameArr.splice(-1);
    editBranchNameArr.push("edit");
    const editBranchName = editBranchNameArr.join("/");

    const created = commit(
      project.id,
      repository.id,
      editBranchName,
      filePath,
      inputText,
      commitMessage
    );
    if (created) {
      setPrevText(inputText);

      setMessage({ message: "Data saved successfully", severity: "success" });
    } else {
      setMessage({ message: "Unable to save data...", severity: "error" });
    }
  }
  function toggleEditModeData() {
    setEditMode((prev) => !prev);
  }

  React.useEffect(() => {
    if (!editMode) getFileContent(objectId);
  }, [objectId, editMode]);

  React.useEffect(() => {
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
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingX: "24px",
        }}
      >
        <EditConfModal
          commitMessage={commitMessage}
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
          {editMode && (
            <IconButton disabled={inputText === prevText}>
              <SaveIcon
                sx={{ cursor: "pointer" }}
                onClick={() => setOpen(true)}
              ></SaveIcon>
            </IconButton>
          )}
          <IconButton>
            <EditIcon
              onClick={toggleEditModeData}
              sx={{ cursor: "pointer", paddingX: "5px" }}
            ></EditIcon>
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {editMode && (
          <MarkedEditView
            inputText={inputText}
            setInputTextfun={setInputTextfun}
            setPrevText={setPrevText}
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
