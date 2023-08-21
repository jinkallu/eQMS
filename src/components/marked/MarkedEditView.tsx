import React, { useState, useEffect, useRef } from "react";
import useMarkdToHTML from "./useMarkdToHTML";

import MarkedEditor from "./MarkedEditor";
import MarkedHTMLViewer from "./MarkedHTMLViewer";
import { Box, Chip, Paper, Typography } from "@mui/material";
import { useExtnStore } from "../../zustand/store";

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
  //   const [inputText, setInputText] = useState("");
  const [parsedHTML, setParsedHTML] = useState("");
  const [markWidth, setMarkWidth] = React.useState(true);
  const [htmlWidth, setHtmlWidth] = React.useState(true);

  const { loadingHTML, markdToCustom } = useMarkdToHTML();
  const { getEditBranch, repository } = useExtnStore((state) => state);
  const project = useExtnStore((state) => state.project);

  // if edit branch doesnt exist- Then create a copy contents from main to edit
  // if edit branch exists... fetch contents from edit branch...

  useEffect(() => {
    function parseMarkdown() {
      if (inputText && inputText.trim() !== "") {
        const childHTMLDOM = markdToCustom(inputText, "markedHTMLViewer");
      }
    }

    // Call the parseMarkdown function whenever inputText changes
    parseMarkdown();
  }, [inputText]);

  useEffect(() => {
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
        setInputText(data);
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
      <Paper elevation={3} sx={{ flex: markWidth ? 1 : 0 }}>
        <MarkedEditor
          setMarkWidth={setMarkWidth}
          inputText={inputText}
          setInputText={setInputText}
        />
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
          <MarkedHTMLViewer inputText={parsedHTML} />
        </Box>
      </Paper>
    </Box>
  );
}
