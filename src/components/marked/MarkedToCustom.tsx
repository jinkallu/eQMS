import { Grid, Modal, Button, Paper, Box } from "@mui/material";
import Viewers from "./Viewers";
import React, { useState, useEffect, useRef } from "react";

export default function MarkedToCustom({
  element,
  open,
  setOpen,
  order,
  state,
  handleChange,
}) {
  function handleCancel() {
    setOpen(false);
  }

  return (
    <div>
      <Viewers
        state={state}
        handleChange={handleChange}
        element={element}
        order={order}
      >
        {element?.childNodes?.length > 0 &&
          Array.from(element.childNodes).map((child, index) => (
            
            <MarkedToCustom
              key={index}
              element={child}
              open={open}
              setOpen={setOpen}
              order={order}
              state={state}
              handleChange={handleChange}
            ></MarkedToCustom>
          ))}
      </Viewers>
    </div>
  );
}
