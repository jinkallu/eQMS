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
  productId,
}) {
  function handleCancel() {
    setOpen(false);
  }

  return (
    <Box sx={{ width: "100%", overflowX: "100%" }}>
      <Viewers
        state={state}
        handleChange={handleChange}
        element={element}
        order={order}
        productId={productId}
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
              productId={productId}
              handleChange={handleChange}
            ></MarkedToCustom>
          ))}
      </Viewers>
    </Box>
  );
}
