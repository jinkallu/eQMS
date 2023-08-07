import MarkedHTMLViewer from "./marked/MarkedHTMLViewer";
import { useSearchParams } from "react-router-dom";
import { useGetRepoDetails } from "../zustand/store";
import React from "react";
import { markedToHtml } from "../utils/markedHelper";
import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MarkedEditView from "./marked/MarkedEditView";

export default function HTMLViewer() {
  const { htmlContents, fileContentLoading, branchFileNames, setFileContent } =
    useGetRepoDetails((state) => state);

  const [inputText, setInputText] = React.useState("");
  const [branch, setBranch] = React.useState<any>();
  const [editMode, setEditMode] = React.useState(false);

  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");

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

  function toggleEditModeData() {
    setEditMode((prev) => !prev);
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
        <Chip
          label={branch?.relativePath?.split("-")?.slice(1)?.join(" ")}
          color="primary"
          variant="outlined"
        ></Chip>
        <Box>
          <EditIcon
            onClick={toggleEditModeData}
            sx={{ cursor: "pointer" }}
          ></EditIcon>
        </Box>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {editMode && <MarkedEditView inData={inputText}></MarkedEditView>}
        {!editMode && (
          <MarkedHTMLViewer inputText={inputText}></MarkedHTMLViewer>
        )}
      </Box>
    </Box>
  );
}
