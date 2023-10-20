import { Grid } from "@mui/material";
import Viewers from "./Viewers";
import React, { useState, useEffect, useRef } from "react";


export default function MarkedToCustom({ element, children }) {
    const [state, setState] = React.useState("");
    return (
        <div>
            <Grid container spacing={2} columns={{ xs: 12 }}>
                <Grid item xs={4}>
                    <Viewers
                        state={state}
                        setState={setState}
                        element={element}
                        order={"first"}
                    ></Viewers>
                </Grid>
                <Grid item xs={4}>
                    <Viewers
                        state={state}
                        setState={setState}
                        element={element}
                        order={"middle"}
                    ></Viewers>
                </Grid>
                <Grid item xs={4}>
                    <Viewers
                        state={state}
                        setState={setState}
                        element={element}
                        order={"last"}
                    ></Viewers>
                </Grid>
            </Grid>
            {children}
        </div>
    );
}