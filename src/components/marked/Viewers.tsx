import React, { useState, useEffect, useRef } from "react";
import InputTagViewer from "./InputTagViewer";
import RenderDomTree from "./RenderDomTree";
import MarkedToCustom from "./MarkedToCustom";
import GenericTag from "./GenericTag";
import EndNode from "./EndNode";
import ProcessFlow from "../ProcessFlow";

export default function Viewers({
  element,
  order,
  state,
  handleChange,
  children,
}) {
  //   const childNodes =
  //     element?.childNodes?.length > 0 &&
  //     Array.from(element.childNodes).map((child, index) => (
  //       <MarkedToCustom element={child}></MarkedToCustom>
  //     ));

  console.log(element?.tageName, element?.textContent);
  if (!element?.tagName) {
    return <EndNode element={element?.textContent || element}></EndNode>;
  }

  //   if (order === "middle") {
  //     console.log("order is middle");
  //     if (element.tagName && element.tagName === "INPUT") {
  //       const id = element.getAttribute("id");
  //       console.log("middle input", id);
  //       return (
  //         <InputTagViewer
  //           state={state}
  //           id={id}
  //           handleChange={handleChange}
  //           element={element}
  //           order={order}
  //         />
  //       );
  //     } else return <div>{children}</div>;
  //   }

  if (element.tagName && element.tagName === "INPUT") {
    const id = element.getAttribute("id");
    return (
      <InputTagViewer
        state={state}
        id={id}
        handleChange={handleChange}
        element={element}
        order={order}
      />
    );
  } else if (element.tagName && element.tagName === "BODY") {
    return <div>{children}</div>;
  } else if (element.tagName && element.tagName === "P") {
    // if (children?.length === 1) {
    //   return children;
    // }
    return <p>{children}</p>;
  }

  if (element.tagName && element.tagName === "PROCESSFLOW") {
    return <ProcessFlow></ProcessFlow>;
  } else if (children.length === 0) {
    return <EndNode element={element?.textContent || element}></EndNode>;
  } else {
    const clonedElement = element.cloneNode();

    // Remove the cloned element's children
    while (clonedElement.firstChild) {
      clonedElement.removeChild(clonedElement.firstChild);
    }

    let newAttribute = {};

    const attributes = Array.from(element.attributes)?.map((item: any) => {
      if (item.name === "style") {
        const styleVal = {};
        const props = item.value.split(";");
        props?.map((prop) => {
          const newPrp = prop.split(":");
          styleVal[newPrp[0].trim()] = newPrp[1];
          return prop;
        });

        newAttribute[item.name] = { ...styleVal };
      } else newAttribute[item.name] = item.value;
    });
    let newEle;
    if (children?.length > 0) {
      newEle = React.createElement(
        clonedElement.tagName.toLowerCase(),
        { ...newAttribute },
        children
      );
    } else {
      return <EndNode element={element?.textContent || element}></EndNode>;
    }

    return newEle;
    // return <div dangerouslySetInnerHTML={{ __html: element.outerHTML }}></div>;
  }
}
