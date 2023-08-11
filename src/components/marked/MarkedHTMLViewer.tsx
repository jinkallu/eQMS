import React from "react";
import { markedToHtml } from "../../utils/markedHelper";

export default function MarkedHTMLViewer({ inputText }) {
  const [html, setHtml] = React.useState("");

  async function getHtml() {
    const html = await markedToHtml(inputText);
    setHtml(html);
  }

  React.useEffect(() => {
    getHtml();
  }, [inputText]);
  return (
    <div
      id="markedHTMLViewer"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        boxSizing: "border-box",
        display: "flex",
        wordBreak: "break-word",
        flexDirection: "column",
      }}
    ></div>
  );
}
