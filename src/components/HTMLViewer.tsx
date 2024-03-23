import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useExtnStore } from "../zustand/store";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Toolbar from "@mui/material/Toolbar";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import useCommit from "../CHooks/useCommit";
import EditConfModal from "./EditConfModal";
import useGetTeamMembers from "../CHooks/useGetTeamMembers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import VersionSelector from "./VersionSelector";
import { pageWidths } from "../constants";
import TiptapEditor from "./marked/ReactCustomTags/TiptapEditor";

export default function HTMLViewer() {
  const {
    fileContentLoading,
    getFileContent,
    getEditBranch,
    repository,
    pageWidth,
    setPageWidth,
    editorState,
  } = useExtnStore((state) => state);

  const project = useExtnStore((state) => state.project);

  const [inputText, setInputText] = useState("");
  const [html, setHtml] = useState("");
  const [htmlEdit, setHtmlEdit] = useState("");

  const [branch, setBranch] = useState<any>();
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const { commit, loading: loadingCommit } = useCommit();
  const [viewEditBranch, setViewEditBranch] = useState(false);
  const [version, setVersion] = useState(null);
  const setAlertMessage = useExtnStore((state) => state.setAlertMessage);
  const [loading, setLoading] = useState(false);
  // const [state, setState] = React.useState<{ key: string; value: any }>({
  //   key: "initialKey",
  //   value: "initialValue",
  // });
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

  async function getFileContentData() {
    setLoading(true);
    let newBranchName = branchName;

    let lastIndex = branchName.lastIndexOf("/main");

    if (viewEditBranch) {
      //Replace the last occurrence with "/edit"
      newBranchName =
        branchName.substring(0, lastIndex) +
        "/edit" +
        branchName.substring(lastIndex + "/main".length);
    }

    const content = await getFileContent(
      repository.id,
      `/qms/${type}/data.html`,
      newBranchName,
      viewEditBranch ? null : version?.commitId
    );

    if (content && content.trim() !== "") {
      // const parser = new DOMParser();
      //const htmlString = marked(markedData);
      // const htmlData = parser.parseFromString(content, "text/html");
      setHtml(content);
    }
    setLoading(false);
    // setInputText(content);
  }

  async function getDatabaseContent(collectionName, repositoryId) {
    await readDatabase({ collectionName, repositoryId });
  }

  function handleClose() {
    setOpen(false);
  }

  function handleWidthChange(e) {
    const option = pageWidths?.find((item) => item.type === e.target.value);
    if (option) {
      setPageWidth(option);
    }
  }
  async function saveContent(): Promise<boolean> {
    let path = [];
    let processFlowPathArr = [];

    let editBranchNameArr = branchName.split("/");
    path = [editBranchNameArr[0], type, `data.html`];
    // processFlowPathArr = [editBranchNameArr[0], type, `processFlow.txt`];
    const filePath = path.join("/");
    // const processFlowPath = processFlowPathArr.join("/");

    editBranchNameArr.splice(-1);
    editBranchNameArr.push("edit");
    const editBranchName = editBranchNameArr.join("/");

    const createdData = await commit(
      project.id,
      repository.id,
      editBranchName,
      filePath,
      // newHtml?.body?.innerHTML,
      editorState,
      commitMessage
    );

    return createdData;
  }
  function toggleEditModeData() {
    setEditMode((prev) => !prev);
  }

  async function getEditBranchData() {
    setLoading(true);
    const data = await getEditBranch({
      branchName,
      type,
      relativePath,
      repositoryId: repository.id,
      projectId: project.id,
    });
    if (data && data.trim() !== "") {
      const parser = new DOMParser();
      //const htmlString = marked(markedData);
      // const htmlData = parser.parseFromString(data, "text/html");
      setHtml(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (project && repository && branchName) {
      editMode ? getEditBranchData() : getFileContentData();
    }
  }, [project, repository, viewEditBranch, branchName, version, editMode]);

  if (fileContentLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress></CircularProgress>;
      </Box>
    );
  }
  // test
  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          width: "100%",
          opacity: 1,
          zIndex: 50,
          height: "50px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ArrowBackIcon
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(-1)}
              ></ArrowBackIcon>

              {!editMode && (
                <VersionSelector
                  setViewEditBranch={setViewEditBranch}
                  viewEditBranch={viewEditBranch}
                  setVersion={setVersion}
                ></VersionSelector>
              )}
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Chip
                label={relativePath}
                color="primary"
                variant="outlined"
              ></Chip>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                height: "100%",
              }}
            >
              {canEdit && editMode && (
                <SaveIcon onClick={() => setOpen(true)}></SaveIcon>
              )}

              <EditIcon
                onClick={toggleEditModeData}
                sx={{ cursor: "pointer" }}
              ></EditIcon>
            </Box>
          </Grid>
        </Grid>
      </Paper>

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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
          width: "100%",
          backgroundColor: "#F8F8F8",
        }}
      >
        {!editMode && <Toolbar />}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress></CircularProgress>;
          </Box>
        ) : (
          <TiptapEditor editMode={editMode} content={html}></TiptapEditor>
        )}
      </Box>
    </Paper>
  );
}
