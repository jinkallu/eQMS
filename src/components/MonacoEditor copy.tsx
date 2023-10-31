import React, { useState, useEffect, useRef } from "react";
// import useMarkdToHTML from "";
import Editor, { useMonaco } from "@monaco-editor/react";

import { marked } from "marked";

import {
  Box,
  Chip,
  Paper,
  Typography,
  Grid,
  Button,
  Modal,
} from "@mui/material";
import { useExtnStore } from "../zustand/store";
import MarkedToCustom from "./marked/MarkedToCustom";

export default function MonacoEditor({
  inputText,
  setInputText,
  objectId,
  relativePath,
  type,
  branchName,
}: {
  inputText: string;
  setInputText: (val: string) => void;
  objectId: string;
  type: string;
  relativePath: string;
  branchName: string;
}) {
  //const [inputText, setInputText] = useState(inData);

  const [markedData, setMarkedData] = React.useState<string>();
  const [html, setHtml] = React.useState<HTMLElement>();
  const [open, setOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState();
  const [state, setState] = React.useState({});

  const { getEditBranch, repository } = useExtnStore((state) => state);
  const project = useExtnStore((state) => state.project);
  async function getData() {
    if (!repository?.id || !project?.id) {
      return;
    }
    const data = await getEditBranch({
      objectId,
      branchName,
      type,
      relativePath,
      repositoryId: repository.id,
      projectId: project.id,
    });
    setMarkedData(data);
  }

  useEffect(() => {
    if (markedData && markedData.trim() !== "") {
      const parser = new DOMParser();
      const htmlString = marked(markedData);
      const htmlData = parser.parseFromString(htmlString, "text/html");

      setHtml(htmlData.body);

      console.log(htmlData.body.getElementsByTagName("INPUT"));
    }
  }, [markedData]);

  function handleChangeEditor(value, event) {
    setMarkedData(value);
  }
  const handleChange = (id, value) => {
    setState((values) => ({ ...values, [id]: value }));
  };
  console.log(modalContent);
  useEffect(() => {
    getData();
  }, [objectId, type, branchName, relativePath, repository, project]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        width: "100%",
        border: "1px solid black",
      }}
    >
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "24px",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "36px",
              flexDirection: "column",
              gap: "12px",
              height: "100%",
            }}
          >
            {html?.getElementsByTagName("INPUT")?.length > 0 &&
              Array.from(html?.getElementsByTagName("INPUT"))?.map((item) => {
                const id = item.getAttribute("id");

                return (
                  <input
                    value={state[id]}
                    onChange={(e) => handleChange(id, e.target.value)}
                  ></input>
                );
              })}
          </Paper>
        </Box>
      </Modal>
      <Button onClick={() => setOpen(true)}>Open form </Button>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Editor
            height="90vh"
            defaultLanguage="markdown"
            defaultValue={markedData}
            value={markedData}
            onChange={handleChangeEditor}
          />
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={6}>
          <MarkedToCustom
            element={html}
            open={open}
            setOpen={setOpen}
            order="last"
            state={state}
            handleChange={handleChange}
          ></MarkedToCustom>
          {/* <div dangerouslySetInnerHTML={{ __html: html }}></div> */}
        </Grid>
      </Grid>
    </Box>
  );
}
