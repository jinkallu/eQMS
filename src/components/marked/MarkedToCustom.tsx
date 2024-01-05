import { Grid, Modal, Button, Paper, Box } from "@mui/material";
import Viewers from "./Viewers";
import React, { useState, useEffect, useRef } from "react";

export default function MarkedToCustom({
  element,
  open,
  setOpen,
  order,
  productId,
}) {
  function handleCancel() {
    setOpen(false);
  }

  useEffect(() => {
    console.log(element);
  }, [element]);

  return (
    <Viewers element={element} order={order} productId={productId}>
      {element?.childNodes?.length > 0 &&
        Array.from(element.childNodes).map((child, index) => (
          <MarkedToCustom
            key={index}
            element={child}
            open={open}
            setOpen={setOpen}
            order={order}
            productId={productId}
          ></MarkedToCustom>
        ))}
    </Viewers>
  );
}
