import React from "react";

import { Box, Typography } from "@mui/material";

export default function DynamicIsland({
  message,
  severity,
  open,
  defaultMessage,
}) {
  return (
    <Box
      sx={{
        width: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "15px",
        marginLeft: "10px",
        marginRight: "10px",
        padding: "15px",
        borderRadius: "10px",
        backgroundColor: "#0b204d",
        color: "white",
      }}
    >
      <Typography>{open ? message : defaultMessage}</Typography>
    </Box>
  );
}
