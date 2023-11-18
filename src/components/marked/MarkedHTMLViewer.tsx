import React, { useEffect } from "react";
import MdFunctions from "./customtags/MdFunctions";
import { markedToHtml } from "../../utils/markedHelper";
import useMarkdToHTML from "./useMarkdToHTML";
import MarkedToCustom from "./MarkedToCustom";

export default function MarkedHTMLViewer({
  markedText,
  ready,
  edit,
  html,
  state,
  setHtml,
}) {
  //const [html, setHtml] = React.useState();

  // const { editorReady, htmlEditorReady, loadingHTML, markdToCustom } =
  //   useMarkdToHTML();

  // useEffect(() => {
  //   if (ready) {
  //     if (markedText && markedText.trim() !== "") {
  //       //console.log(markedText);
  //       if (edit) {
  //         const childHTMLDOM = markdToCustom(
  //           false,
  //           markedText,
  //           "markedHTMLViewer",
  //           2,
  //           0,
  //           null
  //         );
  //       } else {
  //         // TODO: correct it, now only showing edit mode!
  //         const childHTMLDOM = markdToCustom(
  //           false,
  //           markedText,
  //           "markedHTMLViewer",
  //           3,
  //           0,
  //           null
  //         );
  //       }
  //     }
  //   }
  // }, [ready, markedText, edit]);

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
    <div
      id="markedHTMLViewer"
      //dangerouslySetInnerHTML={{ __html: markedText }} // TODO: Set proper html
      style={{
        boxSizing: "border-box",
        display: "flex",
        wordBreak: "break-word",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "40px",
        border: "1px solid red",
      }}
    >
      <MarkedToCustom
        element={html?.body}
        open={null}
        setOpen={null}
        order="last"
        state={state}
        handleChange={null}
      ></MarkedToCustom>
    </div>
  );
}
