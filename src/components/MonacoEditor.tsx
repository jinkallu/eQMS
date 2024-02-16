import React, { useState, useEffect, useRef } from "react";
// import useMarkdToHTML from "";
import Editor, { useMonaco } from "@monaco-editor/react";
import SaveIcon from "@mui/icons-material/Save";
import PreviewIcon from "@mui/icons-material/Preview";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { marked } from "marked";

import {
  Box,
  Chip,
  Paper,
  Typography,
  Grid,
  Button,
  Modal,
  ToggleButtonGroup,
  ToggleButton,
  Toolbar,
  Tooltip,
} from "@mui/material";

import { useExtnStore } from "../zustand/store";
import MarkedToCustom from "./marked/MarkedToCustom";
import useMarkdToHTML from "./marked/useMarkdToHTML";

export default function MonacoEditor({
  objectId,
  relativePath,
  type,
  branchName,
  html,
  setOpenEditModal,
  productId,
  toggleEditModeData,
}: {
  objectId: string;
  type: string;
  relativePath: string;
  branchName: string;
  html: Document;
  setOpenEditModal: (val: boolean) => void;
  productId?: string;
  toggleEditModeData: () => void;
}) {
  // const [markedData, setMarkedData] = React.useState<string>();
  const [open, setOpen] = React.useState(false);

  const [editorView, setEditorView] = React.useState("form");

  const {
    getEditBranch,
    repository,
    templateState,
    undoTemplateState,
    redoTemplateState,
  } = useExtnStore((state) => state);
  const project = useExtnStore((state) => state.project);

  // async function getData() {
  //   if (!repository?.id || !project?.id || !branchName) {
  //     return;
  //   }
  //   // let editBranchNameArr = branchName?.split("/");
  //   // editBranchNameArr.splice(-1);
  //   // editBranchNameArr.push("edit");
  //   // const editBranchName = editBranchNameArr.join("/");
  //   const data = await getEditBranch({
  //     objectId,
  //     branchName,
  //     type,
  //     relativePath,
  //     repositoryId: repository.id,
  //     projectId: project.id,
  //   });

  //   // setMarkedData(data);
  //   const parser = new DOMParser();
  //   //const htmlString = marked(data);
  //   const htmlData = parser.parseFromString(data, "text/html");

  //   setHtml(htmlData);
  // }

  function handleEditorViewChange(e) {
    setEditorView(e.target.value);
  }
  // useEffect(() => {
  //   getData();
  // }, [objectId, type, branchName, relativePath, repository, project]);

  useEffect(() => {
    if (!html || !templateState) {
      return;
    }

    Object.keys(templateState)?.map((key) => {
      const ele = html.getElementById(key);
      if (ele) ele.setAttribute("value", templateState[key]);
    });
  }, [templateState, html]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        width: "100%",
        position: "relative",
        overflowX: "auto",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          position: "fixed",
          width: "100%",
          zIndex: 100,
          opacity: 1,
          // height: "40px",
        }}
      >
        <Toolbar />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <ToggleButtonGroup
            color="primary"
            value={editorView}
            exclusive
            onChange={handleEditorViewChange}
            aria-label="Editor type"
            size="small"
          >
            <ToggleButton value="editor">Editor</ToggleButton>
            <ToggleButton value="form">Form</ToggleButton>
          </ToggleButtonGroup>
          <UndoIcon onClick={undoTemplateState}></UndoIcon>
          <RedoIcon onClick={redoTemplateState}></RedoIcon>

          <SaveIcon onClick={() => setOpenEditModal(true)}></SaveIcon>
        </Box>

        <Typography>Viewer</Typography>
        <Tooltip title="Exit Edit Mode">
          <PreviewIcon
            onClick={toggleEditModeData}
            sx={{ cursor: "pointer" }}
          ></PreviewIcon>
        </Tooltip>
      </Paper>
      <Toolbar />

      {html && (
        <Box sx={{ marginTop: "40px", width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <Paper sx={{ paddingX: "9px" }}>
                <MarkedToCustom
                  element={html?.body}
                  open={open}
                  setOpen={setOpen}
                  order={editorView === "editor" ? "first" : "middle"}
                  productId={productId}
                ></MarkedToCustom>
              </Paper>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6}>
              <Paper sx={{ paddingX: "9px" }}>
                <MarkedToCustom
                  element={html?.body}
                  open={open}
                  setOpen={setOpen}
                  order="last"
                  productId={productId}
                ></MarkedToCustom>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
