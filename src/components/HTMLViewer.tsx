import MarkedHTMLViewer from "./marked/MarkedHTMLViewer";
import { useSearchParams } from "react-router-dom";
import { useGetRepoDetails } from "../zustand/store";
import React from "react";
import { markedToHtml } from "../utils/markedHelper";

export default function HTMLViewer() {
  const { htmlContents } = useGetRepoDetails((state) => state);

  const [inputText, setInputText] = React.useState("");

  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");

  React.useEffect(() => {
    const text = htmlContents[objectId];
    setInputText(text);
  }, [objectId, htmlContents]);
  return <MarkedHTMLViewer inputText={inputText}></MarkedHTMLViewer>;
}
