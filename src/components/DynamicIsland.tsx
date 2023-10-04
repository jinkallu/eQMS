import React from "react";

import { Box, Typography } from "@mui/material";
import { useExtnStore } from "../zustand/store";

export default function DynamicIsland({}) {
  const messageDIsland = useExtnStore((state) => state.messageDIsland);
  const open = useExtnStore((state) => state.open);
  const defaultMessage = useExtnStore((state) => state.defaultMessage);
  const temporary = useExtnStore((state) => state.temporary);
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
      <Typography>{open ? messageDIsland : defaultMessage}</Typography>
    </Box>
  );
}
