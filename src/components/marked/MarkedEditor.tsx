import { Box, Chip, TextField } from "@mui/material";
import React from "react";

export default function MarkedEditor({
  inputText,
  setInputText,
  setMarkWidth,
}) {
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <Box
      id="markedEditor"
      sx={{
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Chip
        onClick={() => setMarkWidth((prev) => !prev)}
        label="Markdown Editor"
        color="primary"
        sx={{ paddingBottom: "5px" }}
      ></Chip>
      <TextField
        value={inputText}
        onChange={handleInputChange}
        multiline
        variant="standard"
        maxRows={100000}
      />
    </Box>
  );
}
