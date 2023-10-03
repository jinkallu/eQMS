import React, { useEffect } from 'react';
import MdFunctions from './customtags/MdFunctions';
import { markedToHtml } from "../../utils/markedHelper";
import useMarkdToHTML from "./useMarkdToHTML";



export default function MarkedHTMLViewer({ markedText,  ready, edit}) {
  const [html, setHtml] = React.useState("");

  const { editorReady, htmlEditorReady, loadingHTML, markdToCustom } = useMarkdToHTML();


  useEffect(() => {
    if(ready){
      if(markedText && markedText.trim() !== ""){
        //console.log(markedText);
        if(edit){
          const childHTMLDOM = markdToCustom(false, markedText, "markedHTMLViewer", 2, 0, null);
        }
        else{
          const childHTMLDOM = markdToCustom(false, markedText, "markedHTMLViewer", 0, 0, null);
        }
      }
    }
  }, [ready, markedText, edit]);

  useEffect(() => {
    console.log(markedText);
    if(markedText){
      //MdFunctions.registerEvents('markedHTMLViewer');
    }
  }, [markedText]); // The second argument is an array of dependencies

  async function getHtml() {
    const html = await markedToHtml(markedText);
    console.log(html);
    setHtml(html);
  }

  React.useEffect(() => {
    getHtml();
  }, [markedText]);

    return (
    <div 
      id="markedHTMLViewer" 
      //dangerouslySetInnerHTML={{ __html: markedText }} // TODO: Set proper html
      style={{boxSizing: 'border-box',  display: 'flex' , wordBreak: 'break-word', flexDirection: 'column' }}
    >
    </div>
    )
//import React from "react";

//export default function MarkedHTMLViewer({ inputText }) {

  
  // return (
  //   <div
  //     id="markedHTMLViewer"
  //     dangerouslySetInnerHTML={{ __html: html }}
  //     style={{
  //       boxSizing: "border-box",
  //       display: "flex",
  //       wordBreak: "break-word",
  //       flexDirection: "column",
  //     }}
  //   ></div>
  // );
}
