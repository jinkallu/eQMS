import React from "react";

import { Box } from "@mui/material";
import DynamicIsland from "./DynamicIsland";
import { useDynamicIsland } from "../zustand/store";

export default function Layout() {
  const setDefaultMessage = useDynamicIsland(
    (state) => state.setDefaultMessage
  );

  React.useEffect(() => {
    setDefaultMessage("QMS");
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DynamicIsland></DynamicIsland>
      </Box>
    </Box>
  );
}
