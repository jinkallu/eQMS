import MarkedHTMLViewer from "./marked/MarkedHTMLViewer";
import { useSearchParams } from "react-router-dom";
import { useGetRepoDetails } from "../zustand/store";
import React from "react";
import { markedToHtml } from "../utils/markedHelper";
import { Box, CircularProgress } from "@mui/material";

export default function HTMLViewer() {
  const { htmlContents, fileContentLoading, branchFileNames, setFileContent } =
    useGetRepoDetails((state) => state);

  const [inputText, setInputText] = React.useState("");

  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");

  async function getFileContent(objectId) {
    const branch = branchFileNames?.find((item) => item.objectId === objectId);

    await setFileContent(
      branch.repositoryId,
      `/qms/${branch.type}/${branch.relativePath}/${branch.relativePath}.md`,
      branch.name,
      branch.objectId
    );
  }

  React.useEffect(() => {
    getFileContent(objectId);
  }, [objectId]);

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
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <MarkedHTMLViewer inputText={inputText}></MarkedHTMLViewer>;
    </Box>
  );
}
