import React, { useState, useEffect, useRef } from "react";
import useMarkdToHTML from "./useMarkdToHTML";
import EditorSave from "./EditerSave";

//import MarkedEditor from "./MarkedEditor";
import Editor from "./Editor";
import HTMLEditor from "./HTMLEditor";
import MarkedHTMLViewer from "./MarkedHTMLViewer";
import { Box, Chip, Paper, Typography, Grid } from "@mui/material";
import { useExtnStore } from "../../zustand/store";
import MarkedToHTML from "./MarkedToHTML";
//import { createPortal } from "react-dom";
//export default function MarkedEditView({ inData }) {

// function EditorNew({ htmlDom }) {
//   console.log(htmlDom);
//   const ref = React.useRef(null);

//   useEffect(() => {
//     while (ref.current.firstChild) {
//       ref.current.removeChild(ref.current.firstChild);
//     }
//     htmlDom &&
//       htmlDom?.map((item) => {
//         ref.current.appendChild(item);
//         return item;
//       });
//     // ref.current.appendChild(htmlDom);
//   }, [htmlDom]);

//   return <div ref={ref}></div>;
// }
/*
function ElementContainer({ marked }) {
  const [state, setState] = React.useState("");
  return (
    <Grid container spacing={2} columns={{ xs: 12 }}>
      <Grid item xs={4}>
        <EditorEle
          state={state}
          setState={setState}
          marked={marked}
          order={"first"}
        ></EditorEle>
      </Grid>
      <Grid item xs={4}>
        <EditorEle
          state={state}
          setState={setState}
          marked={marked}
          order={"middle"}
        ></EditorEle>
      </Grid>
      <Grid item xs={4}>
        <EditorEle
          state={state}
          setState={setState}
          marked={marked}
          order={"last"}
        ></EditorEle>
      </Grid>
    </Grid>
  );
}

function EditorEle({ marked, order, state, setState }) {
  switch (order) {
    case "first":
      return marked;

      break;

    case "middle":
      return (
        <input value={state} onChange={(e) => setState(e.target.value)}></input>
      );
      break;
    case "last":
      return <span>{state}</span>;
    default:
      return <h1>Error</h1>;
      break;
  }
}*/

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
  //const [inputText, setInputText] = useState(inData);
  const [parsedHTML, setParsedHTML] = useState(false);
  const [markWidth, setMarkWidth] = React.useState(true);
  const [htmlWidth, setHtmlWidth] = React.useState(true);
  const [markedData, setMarkedData] = React.useState("");
  const [htmlDom, setHtmlDom] = React.useState<ChildNode>();

  const {
    editorReady,
    htmlEditorReady,
    loadingHTML,
    //markdToCustom,
    registerAllCustomTags,
    //markedToDom,
    markedToComponents
  } = useMarkdToHTML();

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
        // markdToCustom(false, markedData, "Editor", 0, 0, null);
        setParsedHTML(true);
      }
    }

    // Call the parseMarkdown function whenever inputText changes
    parseMarkdown();

    //const htmlDomData = markedToDom(markedData);
    //console.log(htmlDomData);

    //setHtmlDom(htmlDomData);
  }, [markedData]);

  useEffect(() => {
    /*if (editorReady) {
      const htmlEditor = markdToCustom(
        false,
        markedData,
        "HTMLEditor",
        1,
        0,
        null
      );
    }*/
  }, [editorReady]);

  useEffect(() => {
    // here instead of markd, create a doc with children of HTMLEditor div and pass to a function
    /*const htmlDocument = document.implementation.createHTMLDocument();
    const htmlEditor = document.getElementById("HTMLEditor");
    Array.from(htmlEditor.childNodes).forEach(node => {
      htmlDocument.body.appendChild(node.cloneNode(true));
    });*/
    //const childHTMLDOM = markdToCustom(false, markedData, "markedHTMLViewer", 2, 0, null);
  }, [htmlEditorReady]);

  const tmpSave = () => {
    const md = EditorSave.findEditableMds(markedData, "Editor");
  };

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
      if (data) {
        //setInputText(data); // changed here, because inputText is already contains main branch data
        console.log(data);
        setMarkedData(data);
      }
    });
  }, [objectId, type, branchName, relativePath, repository, project]);

  useEffect(() => {
    registerAllCustomTags();
  }, []);

  return (
    <Box
      id="MarkedEditView"
      sx={{
        display: "flex",
        minHeight: "90vh",
        flexGrow: 1,
        padding: "5px",
        gap: "5px",
        width: "100%",
      }}
    >
      {/* <Paper elevation={3} sx={{ height: "100%" }}>
        <Chip
          onClick={() => setHtmlWidth((prev) => !prev)}
          label="Marked Editor"
          color="primary"
        ></Chip> */}
      {/* <Editor editorReady={editorReady} /> */}

      {/* <ElementContainer marked="<input>"></ElementContainer> */}
      { <MarkedToHTML mdstring = "<input></input><input></input>" />}
      {/* </Paper> */}

      {/* <Paper elevation={3} sx={{ height: "100%", flex: markWidth ? 1 : 0 }}>
        <Chip
          onClick={() => setHtmlWidth((prev) => !prev)}
          label="HTML Editor"
          color="primary"
        ></Chip>
        <HTMLEditor htmlEditorReady={htmlEditorReady} />
      </Paper> */}

      {/* <Paper
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
          <MarkedHTMLViewer
            markedText={markedData}
            ready={htmlEditorReady}
            edit={true}
          />
        </Box>
      </Paper> */}
    </Box>
  );
}
