import { Grid } from "@mui/material";
import Viewers from "./Viewers";
import React, { useState, useEffect, useRef } from "react";

export default function MarkedToCustom({ element }) {
  const [state, setState] = React.useState("");

  return (
    <div>
      {/* <Grid container spacing={2} columns={{ xs: 12 }}>
        <Grid item xs={4}> */}
      <Viewers
        state={state}
        setState={setState}
        element={element}
        order={"first"}
      >
        {element?.childNodes?.length > 0 &&
          Array.from(element.childNodes).map((child, index) => (
            <MarkedToCustom key={index} element={child}></MarkedToCustom>
          ))}
      </Viewers>
      {/* </Grid> */}
      {/* <Grid item xs={4}>
          <Viewers
            state={state}
            setState={setState}
            element={element}
            order={"middle"}
          >
            {element?.childNodes?.length > 0 &&
              Array.from(element.childNodes).map((child, index) => (
                <MarkedToCustom key={index} element={child}></MarkedToCustom>
              ))}
          </Viewers>
        </Grid>
        <Grid item xs={4}>
          <Viewers
            state={state}
            setState={setState}
            element={element}
            order={"last"}
          >
            {element?.childNodes?.length > 0 &&
              Array.from(element.childNodes).map((child, index) => (
                <MarkedToCustom element={child}></MarkedToCustom>
              ))}
          </Viewers>
        </Grid> */}
      {/* </Grid> */}
    </div>
  );
}
