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
import MarkedToCustom from "./marked/MarkedToCustom";

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
    // processFlowPathArr = [editBranchNameArr[0], type, `processFlow.txt`];
    const filePath = path.join("/");
    // const processFlowPath = processFlowPathArr.join("/");

    editBranchNameArr.splice(-1);
    editBranchNameArr.push("edit");
    const editBranchName = editBranchNameArr.join("/");

    const processFlowEls = html?.getElementsByTagName("PROCESSFLOW");
    // const edges = state["processFlow"]?.edges || [];
    // const nodes = state["processFlow"]?.nodes || [];

    const nodes = [
      {
        id: "A",
        data: {
          label: "SOP Name",
        },
        type: "group",
        position: {
          x: 0,
          y: 0,
        },

        draggable: true,
      },

      {
        id: "Order Request",
        type: "step",
        position: {
          x: 200,
          y: 100,
        },
        data: {
          label: "Order Request",
          type: "step",
          templateName: "Order Request Template",
          templateId: null,
        },
        parentNode: "A",
        extent: "parent",
        draggable: true,
        width: 150,
        height: 50,
      },
      {
        id: "Order Confirmation",
        type: "step",
        position: {
          x: 200,
          y: 200,
        },
        data: {
          label: "Order Confirmation",
          type: "step",
          templateName: "Order Confirmation Template",
          templateId: null,
        },
        parentNode: "A",
        extent: "parent",
        draggable: true,
        width: 150,
        height: 50,
      },
      {
        width: 150,
        height: 50,
        id: "step11-step",
        type: "step",
        position: {
          x: 200,
          y: 400,
        },
        data: {
          label: "step11",
          type: "step",
          templateName: "1_Risk_Management_Plan",
          templateId: "a613d234-3519-4422-96b8-469823744d6f",
        },
        parentNode: "A",
        extent: "parent",
        draggable: true,
        positionAbsolute: {
          x: 200,
          y: 200,
        },
      },
      {
        width: 150,
        height: 50,
        id: "sddfd-step",
        type: "multidec",
        position: {
          x: 200,
          y: 600,
        },
        data: {
          label: "sddfd",
          type: "multidec",
          field: "Name",
          conditions: ["44", "55"],
        },
        parentNode: "A",
        extent: "parent",
        draggable: true,
        positionAbsolute: {
          x: 200,
          y: 400,
        },
      },
      {
        width: 150,
        height: 50,
        id: "My step 1-step",
        type: "step",
        position: {
          x: 300,
          y: 800,
        },
        data: {
          label: "My step 1",
          type: "step",
        },
        parentNode: "A",
        extent: "parent",
        draggable: true,
        positionAbsolute: {
          x: 200,
          y: 400,
        },
      },
      {
        width: 150,
        height: 50,
        id: "My step 2-step",
        type: "step",
        position: {
          x: 400,
          y: 800,
        },
        data: {
          label: "My step 2",
          type: "step",
        },
        parentNode: "A",
        extent: "parent",
        draggable: true,
        positionAbsolute: {
          x: 200,
          y: 400,
        },
      },
      {
        width: 150,
        height: 50,
        id: "sddfdsdsd-step",
        type: "step",
        position: {
          x: 300,
          y: 1000,
        },
        data: {
          label: "sddfdsdsd",
          type: "step",
          templateName: "103_Temp3_Management",
          templateId: "e82a0cb9-5c8e-48bd-8b98-70c209f025ad",
        },
        parentNode: "A",
        extent: "parent",
        draggable: true,
        positionAbsolute: {
          x: 300,
          y: 800,
        },
      },
    ];

    const edges = [
      {
        id: "Order Request_Order Confirmation",
        source: "Order Request",
        target: "Order Confirmation",
        targetHandle: "target",
        sourceHandle: "source_bottom",
      },
      {
        id: "Order Confirmation_step11-step",
        source: "Order Confirmation",
        target: "step11-step",
        sourceHandle: "source_bottom",
        targetHandle: "target",
      },
      {
        id: "step11-step_sddfd-step",
        source: "step11-step",
        target: "sddfd-step",
        sourceHandle: "source_bottom",
        targetHandle: "target",
      },
      {
        id: "sddfd-step_My step 1-step",
        source: "sddfd-step",
        target: "My step 1-step",
        sourceHandle: "44",
        targetHandle: "target",
      },
      {
        id: "sddfd-step_My step 2-step",
        source: "sddfd-step",
        target: "My step 2-step",
        sourceHandle: "55",
        targetHandle: "target",
      },
      {
        id: "My step 1-step_sddfdsdsd-step",
        source: "My step 1-step",
        target: "sddfdsdsd-step",
        sourceHandle: "source_bottom",
        targetHandle: "target",
      },
    ];
    Array.from(processFlowEls)?.map((flow: HTMLElement) => {
      flow.dataset.nodes = JSON.stringify(nodes);
      flow.dataset.edges = JSON.stringify(edges);
      return flow;
    });

    // const md = EditorSave.findEditableMds(inputText, "Editor");

    const createdData = await commit(
      project.id,
      repository.id,
      editBranchName,
      filePath,
      html?.body?.innerHTML,
      commitMessage
    );
    // let createdProcessFlow;
    // if (type === "sop") {
    //   createdProcessFlow = await commit(
    //     project.id,
    //     repository.id,
    //     editBranchName,
    //     processFlowPath,
    //     JSON.stringify(state["processFlow"]),
    //     commitMessage
    //   );
    // }

    return createdData;
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
    if (inputText && inputText.trim() !== "") {
      const parser = new DOMParser();
      //const htmlString = marked(markedData);
      const htmlData = parser.parseFromString(inputText, "text/html");

      setHtml(htmlData);
    }
  }, [inputText]);

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
        width: "100%",
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
          width: "100vw",
          border: "1px solid yellow",
          padding: "24px",
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
          <MarkedToCustom
            element={html?.body}
            open={null}
            setOpen={null}
            order="last"
            state={state}
            handleChange={null}
          ></MarkedToCustom>
        )}
      </Box>
    </Box>
  );
}
