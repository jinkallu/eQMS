import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ProcessFlow from "./ProcessFlow";
import CScape from "../../customtags/cytoscapetags/cscape";
import { Button } from "@mui/material";

//import GraphAnalysis from "../../customtags/cytoscapetags/GraphAnalysis"; // TODO: for future graph analysis

export default function ProcessFlowView({
  order,
  state,
  id,
  handleChange,
  element,
}) {
  console.log("order", order);
  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        display: "flex",
      }}
    >
      {order === "middle" && handleChange && state && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ProcessFlow
              state={state}
              handleChange={handleChange}
              editable={true}
              element={element}
            />
          </Grid>
        </Grid>
      )}
      {order === "last" && handleChange && state && element && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ProcessFlow
              state={state}
              element={element}
              editable={false}
              handleChange={handleChange}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
