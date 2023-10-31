import { marked } from "marked";
import React, { useState, useEffect, useRef } from "react";
//import MarkedToCustom from "./MarkedToCustom";
//import RenderDomTree from "./RenderDomTree";

export default function MarkedToHTML({ mdstring }) {
  const [dom, setDom] = useState(null);

  const parseMarkdownToHTMLString = (markdownText: string) => {
    const parsedHtmlString = marked(markdownText);
    //console.log(parsedHtmlString);
    return parsedHtmlString;
  };

  const parseHTMLStringToDOM = (parsedHtmlString: string): Document => {
    //console.log(parsedHtmlString);
    const parser = new DOMParser();
    const doc = parser.parseFromString(parsedHtmlString, "text/html");
    //console.log(doc);
    return doc;
  };

  function markedToDom() {
    const html: string = parseMarkdownToHTMLString(mdstring);

    const parsedDom = parseHTMLStringToDOM(html);
    setDom(parsedDom.body);
    //console.log(dom);
    //return dom?.body?.firstChild;
  }

  // function RenderDomTree({element}) {
  //     //element = element as HTMLElement;
  //      if (element.nodeType === Node.ELEMENT_NODE) {
  //         // If it's an element, create a React component for it
  //         const component = (
  //             <MarkedToCustom  element={element}>
  //                 { element.childNodes.length > 0 && Array.from(element.childNodes).map((child, index) => <RenderDomTree key={index} element={child}></RenderDomTree>)}
  //             </MarkedToCustom>
  //         );

  //         return component;
  //      } else {
  //     //     // If it's not an element, just return the text content
  //          return (<div></div>)
  //      }
  // }

  useEffect(() => {
    if (mdstring && mdstring.trim() !== "") {
      markedToDom();
    }
  }, [mdstring]);
  console.log(dom);

  return (
    <div>
      {/* {<RenderDomTree element={dom}></RenderDomTree>}
       */}

      {/* <MarkedToCustom element={dom} open={open} setOpen={}></MarkedToCustom> */}
      {/* {dom && Array.from(dom.childNodes).map((child, index) => <RenderDomTree key={index} element={child}></RenderDomTree>)} */}
    </div>
  );
}
