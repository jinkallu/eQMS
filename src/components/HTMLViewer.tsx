import MarkedHTMLViewer from "./marked/MarkedHTMLViewer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useExtnStore } from "../zustand/store";
import React, { useEffect } from "react";
import { markedToHtml } from "../utils/markedHelper";
import {
  Box,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Toolbar,
} from "@mui/material";
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
import MarkedToCustom from "./marked/MarkedToCustom";
import VersionSelector from "./VersionSelector";
import Viewers from "./marked/Viewers";
import { pageWidths } from "../constants";

export default function HTMLViewer() {
  //const { htmlContents, fileContentLoading, branchFileNames, setFileContent } =
  // useGetRepoDetails((state) => state);

  //export default function HTMLViewer() {
  const {
    htmlContents,
    fileContentLoading,
    branchFileNames,
    getFileContent,
    getEditBranch,
    repository,
    templateState,
    setTemplateState,
    pageWidth,
    setPageWidth,
  } = useExtnStore((state) => state);

  const project = useExtnStore((state) => state.project);

  const [inputText, setInputText] = React.useState("");
  const [html, setHtml] = React.useState<Document>();
  const [htmlEdit, setHtmlEdit] = React.useState<Document>();

  const [branch, setBranch] = React.useState<any>();
  const [editMode, setEditMode] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [commitMessage, setCommitMessage] = React.useState("");
  const { commit, loading: loadingCommit } = useCommit();
  const [viewEditBranch, setViewEditBranch] = React.useState(false);
  const [version, setVersion] = React.useState(null);
  const setAlertMessage = useExtnStore((state) => state.setAlertMessage);
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
      const parser = new DOMParser();
      //const htmlString = marked(markedData);
      const htmlData = parser.parseFromString(content, "text/html");
      setHtml(htmlData);
    }

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
    const newHtml = htmlEdit;

    Object.keys(templateState)?.map((key) => {
      const value = templateState[key];
      const ele = newHtml?.getElementById(key);
      if (ele) {
        if (ele.tagName === "INPUT") {
          ele.setAttribute("value", value);
        } else if (ele.tagName === "MD") {
          // ele.innerHTML = value;
        } else if (ele.tagName === "LINKRECORD") {
          ele.setAttribute("records", JSON.stringify(value));
        }
        // else if (ele.tagName === "PROCESSFLOW") {
        //   const edges = state["processFlow"]?.edges || [];
        //   const nodes = state["processFlow"]?.nodes || [];

        //   ele.dataset.nodes = JSON.stringify(nodes);
        //   ele.dataset.edges = JSON.stringify(edges);
        // }
        else {
          ele.setAttribute("value", JSON.stringify(value));
        }
      }
    });

    // Object.entries(templateState)?.map(([key, value]) => {
    //   const ele = newHtml?.getElementById(key);
    //   if (ele) {
    //     if (ele.tagName === "INPUT") {
    //       ele.setAttribute("value", value);
    //     } else if (ele.tagName === "MD") {
    //       // ele.innerHTML = value;
    //     } else if (ele.tagName === "LINKRECORD") {
    //       ele.setAttribute("records", JSON.stringify(value));
    //     }
    //     // else if (ele.tagName === "PROCESSFLOW") {
    //     //   const edges = state["processFlow"]?.edges || [];
    //     //   const nodes = state["processFlow"]?.nodes || [];

    //     //   ele.dataset.nodes = JSON.stringify(nodes);
    //     //   ele.dataset.edges = JSON.stringify(edges);
    //     // }
    //     else {
    //       ele.setAttribute("value", JSON.stringify(value));
    //     }
    //   }
    // });

    // Add node and edges data to html
    const processFlowEls = newHtml?.querySelectorAll("PROCESSFLOW");
    const edges = templateState["processFlow"]?.edges || [];
    const nodes = templateState["processFlow"]?.nodes || [];

    Array.from(processFlowEls)?.map((item: HTMLElement) => {
      item.dataset.nodes = JSON.stringify(nodes);
      item.dataset.edges = JSON.stringify(edges);
      return item;
    });

    // add link record data to html
    // const linkRecord = html?.getElementsByTagName("LINKRECORD");
    // const records = state["linkRecords"];

    // Array.from(linkRecord)?.map((item: HTMLElement) => {
    //   item.setAttribute("records", JSON.stringify(records));
    //   return item;
    // });

    // const md = EditorSave.findEditableMds(inputText, "Editor");
    console.log(editBranchName, filePath);

    const createdData = await commit(
      project.id,
      repository.id,
      editBranchName,
      filePath,
      newHtml?.body?.innerHTML,
      commitMessage
    );

    return createdData;
  }
  function toggleEditModeData() {
    setEditMode((prev) => !prev);
  }

  async function getEditBranchData() {
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
      const htmlData = parser.parseFromString(data, "text/html");
      setHtmlEdit(htmlData);
    }
  }

  const handleChange = (id, value) => {
    const ele = html?.getElementById(id);
    if (ele) {
      if (ele.tagName === "INPUT") {
        ele.setAttribute("value", value);
      } else if (ele.tagName === "MD") {
        const htmlData = new DOMParser().parseFromString(value, "text/html");
        ele.innerHTML = htmlData?.body?.innerHTML;
      } else if (ele.tagName === "LINKRECORD") {
        ele.setAttribute("records", JSON.stringify(value));
      }
      // else if (ele.tagName === "PROCESSFLOW") {
      //   const edges = state["processFlow"]?.edges || [];
      //   const nodes = state["processFlow"]?.nodes || [];

      //   ele.dataset.nodes = JSON.stringify(nodes);
      //   ele.dataset.edges = JSON.stringify(edges);
      // }
      else {
        ele.setAttribute("value", JSON.stringify(value));
      }
    }

    // Add node and edges data to html
    // if (id === "processFlow") {
    //   const processFlowEls = html?.querySelectorAll("PROCESSFLOW");
    //   const edges = value?.edges || [];
    //   const nodes = value?.nodes || [];

    //   Array.from(processFlowEls)?.map((item: HTMLElement) => {
    //     item.dataset.nodes = JSON.stringify(nodes);
    //     item.dataset.edges = JSON.stringify(edges);
    //     return item;
    //   });
    // }
    setTemplateState(id, value);
  };

  React.useEffect(() => {
    if (project && repository && branchName) {
      getFileContentData();
      getEditBranchData();
    }
  }, [project, repository, viewEditBranch, branchName, version]);

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
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Paper
        sx={{
          position: "fixed",
          width: "100%",
          opacity: 1,
          zIndex: 100,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
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
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {!editMode && (
                <FormControl style={{ width: "200px" }}>
                  <InputLabel id="demo-simple-select-label">
                    Select a View Option
                  </InputLabel>
                  <Select
                    labelId="pagewidth-select-label"
                    id="pagewidth-select"
                    value={pageWidth.type}
                    label="View Option "
                    onChange={handleWidthChange}
                  >
                    {pageWidths?.map((widthType) => (
                      <MenuItem key={widthType.type} value={widthType.type}>
                        {widthType.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

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
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
        {editMode ? (
          <MonacoEditor
            objectId={""}
            type={type}
            branchName={branchName}
            relativePath={relativePath}
            html={htmlEdit}
            setOpenEditModal={setOpen}
            toggleEditModeData={toggleEditModeData}
          ></MonacoEditor>
        ) : (
          <Box sx={{ width: pageWidth.width, paddingX: "24px" }}>
            <Toolbar />

            <MarkedToCustom
              key={"base"}
              element={html?.body}
              open={null}
              setOpen={null}
              order="last"
              productId={null}
            ></MarkedToCustom>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
