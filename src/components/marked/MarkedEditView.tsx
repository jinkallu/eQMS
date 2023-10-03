import React, { useState, useEffect, useRef } from "react";
import useMarkdToHTML from "./useMarkdToHTML";
import EditorSave from "./EditerSave";

//import MarkedEditor from "./MarkedEditor";
import Editor from "./Editor";
import HTMLEditor from "./HTMLEditor";
import MarkedHTMLViewer from "./MarkedHTMLViewer";
import { Box, Chip, Paper, Typography } from "@mui/material";
import { useExtnStore } from "../../zustand/store";

//export default function MarkedEditView({ inData }) {
export default function MarkedEditView({
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
  //console.log(inData);
  //const [inputText, setInputText] = useState(inData);
  const [parsedHTML, setParsedHTML] = useState(false);
  const [markWidth, setMarkWidth] = React.useState(true);
  const [htmlWidth, setHtmlWidth] = React.useState(true);
  const [markedData, setMarkedData] = React.useState("");

  const { editorReady, htmlEditorReady, loadingHTML, markdToCustom } = useMarkdToHTML();

  //   const [inputText, setInputText] = useState("");
  //const [parsedHTML, setParsedHTML] = useState("");
  //const [markWidth, setMarkWidth] = React.useState(true);
  //const [htmlWidth, setHtmlWidth] = React.useState(true);

  //const { loadingHTML, markdToCustom } = useMarkdToHTML();
  const { getEditBranch, repository } = useExtnStore((state) => state);
  const project = useExtnStore((state) => state.project);

  // if edit branch doesnt exist- Then create a copy contents from main to edit
  // if edit branch exists... fetch contents from edit branch...

  // type = 0 for editor
  // type = 1 for HTMLEditor
  // type = 2 for HTMLViewer 
  useEffect(() => {
    function parseMarkdown() {
      if (markedData && markedData.trim() !== "") {
        setParsedHTML(false);
        console.log(markedData);
        markdToCustom(false, markedData, "Editor", 0, 0, null);
        setParsedHTML(true);
      }
    }
    console.log(editorReady);

    // Call the parseMarkdown function whenever inputText changes
    parseMarkdown();
  }, [markedData]);

  useEffect(() => {
    console.log(editorReady);
    if (editorReady) {
      console.log(inputText);
      const htmlEditor = markdToCustom(false, markedData, "HTMLEditor", 1, 0, null);

    }
  }, [editorReady]);

  useEffect(() => {
    // here instead of markd, create a doc with children of HTMLEditor div and pass to a function
    /*const htmlDocument = document.implementation.createHTMLDocument();
    const htmlEditor = document.getElementById("HTMLEditor");
    Array.from(htmlEditor.childNodes).forEach(node => {
      htmlDocument.body.appendChild(node.cloneNode(true));
    });*/
    console.log(markedData);
    //const childHTMLDOM = markdToCustom(false, markedData, "markedHTMLViewer", 2, 0, null);

  }, [htmlEditorReady]);

  const tmpSave = () => {
    const md = EditorSave.findEditableMds(markedData, "Editor");
    console.log(md);
  }

  useEffect(() => {
    //markdToCustom(inData, "markedHTMLViewer");
    //markdToCustom(inData, "markedEditor", true, 0);
    //markdToCustom(inData, "markedHTMLViewer", false, 1);
    //}, []);

    getEditBranch({
      objectId,
      branchName,
      type,
      relativePath,
      repositoryId: repository.id,
      projectId: project.id,
    }).then((data) => {
      console.log(data, "data is");
      if (data) {
        //setInputText(data); // changed here, because inputText is already contains main branch data
        setMarkedData(data);
      }
    });
  }, [objectId, type, branchName, relativePath, repository, project]);

  return (

    <Box
      id="MarkedEditView"
      sx={{
        display: "flex",
        minHeight: "90vh",
        flexGrow: 1,
        padding: "5px",
        gap: "5px",
      }}
    >
      <button onClick={tmpSave}>Button</button>
      <Paper elevation={3} sx={{ height: "100%", flex: markWidth ? 1 : 0 }}>
        <Chip
          onClick={() => setHtmlWidth((prev) => !prev)}
          label="Marked Editor"
          color="primary"
        ></Chip>
        <Editor editorReady={editorReady} />
      </Paper>

      <Paper elevation={3} sx={{ height: "100%", flex: markWidth ? 1 : 0 }}>
        <Chip
          onClick={() => setHtmlWidth((prev) => !prev)}
          label="HTML Editor"
          color="primary"
        ></Chip>
        <HTMLEditor htmlEditorReady={htmlEditorReady} />
      </Paper>

      <Paper
        elevation={3}
        sx={{
          flex: htmlWidth ? 1 : 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Chip
          onClick={() => setHtmlWidth((prev) => !prev)}
          label="HTML Viewer"
          color="primary"
        ></Chip>

        <Box
          id="markedHTMLViewerP"
          sx={{ height: "100%", padding: "16px", boxSizing: "border-box" }}
        >
          {/* Render the MarkedHTMLViewer component with the resolved HTML */}
          <MarkedHTMLViewer 
            markedText={markedData} 
            ready = {htmlEditorReady}
            edit = {true}
            />
        </Box>
      </Paper>
    </Box>
  );
}
