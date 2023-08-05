import React from "react";

import { Box, Typography } from "@mui/material";
import { useDynamicIsland } from "../zustand/store";

export default function DynamicIsland({}) {
  const { message, severity, open, defaultMessage, temporary } =
    useDynamicIsland((state) => state);
  return (
    <Box
      sx={{
        width: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "10px",
        marginLeft: "10px",
        marginRight: "10px",
        padding: "5px",
        borderRadius: "10px",
        backgroundColor: "#0b204d",
        color: "white",
      }}
    >
      <Typography>{open ? message : defaultMessage}</Typography>
    </Box>
  );
}
