import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ProcessFlow from "./ProcessFlow";
import CScape from "../../customtags/cytoscapetags/cscape";
import { Button } from "@mui/material";
//import GraphAnalysis from "../../customtags/cytoscapetags/GraphAnalysis"; // TODO: for future graph analysis

export default function ProcessFlowView({ order, id, element }) {
  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        display: "flex",
      }}
    >
      {order === "middle" && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ProcessFlow key="middle" editable={true} element={element} />
          </Grid>
        </Grid>
      )}
      {order === "last" && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ProcessFlow key="last" element={element} editable={false} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
