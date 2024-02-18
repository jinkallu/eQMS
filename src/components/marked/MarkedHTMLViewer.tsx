import React, { useEffect } from "react";
import MdFunctions from "./customtags/MdFunctions";
import { markedToHtml } from "../../utils/markedHelper";
import useMarkdToHTML from "./useMarkdToHTML";
import MarkedToCustom from "./MarkedToCustom";
import Box from "@mui/material/Box";
export default function MarkedHTMLViewer({
  markedText,
  ready,
  edit,
  html,
  state,
  setHtml,
  productId,
}) {
  useEffect(() => {
    if (markedText && markedText.trim() !== "") {
      const parser = new DOMParser();
      //const htmlString = marked(markedData);
      const htmlData = parser.parseFromString(markedText, "text/html");

      setHtml(htmlData);
    }
  }, [markedText]); // The second argument is an array of dependencies

  // async function getHtml() {
  //   const html = await markedToHtml(markedText);
  //   setHtml(html);
  // }

  // React.useEffect(() => {
  //   getHtml();
  // }, [markedText]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "40px",
        border: "1px solid red",
        padding: "24px",
      }}
    >
      <MarkedToCustom
        element={html?.body}
        open={null}
        setOpen={null}
        order="last"
        productId={null}
      ></MarkedToCustom>
    </Box>
  );
}
