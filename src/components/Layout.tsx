import React from "react";

import { Box } from "@mui/material";
import DynamicIsland from "./DynamicIsland";
import { useDynamicIsland } from "../zustand/store";
import MarkedEditView from "./marked/MarkedEditView";

export default function Layout() {
  const setDefaultMessage = useDynamicIsland(
    (state) => state.setDefaultMessage
  );

  React.useEffect(() => {
    setDefaultMessage("QMS");
  }, []);

  return (
    <MarkedEditView />
  );
}
