import React, { useState, useEffect, useRef } from "react";
import InputTagViewer from "./InputTagViewer";
import RenderDomTree from "./RenderDomTree";
import MarkedToCustom from "./MarkedToCustom";
import GenericTag from "./GenericTag";

export default function Viewers({ element, order, state, setState, children }) {
  //   const childNodes =
  //     element?.childNodes?.length > 0 &&
  //     Array.from(element.childNodes).map((child, index) => (
  //       <MarkedToCustom element={child}></MarkedToCustom>
  //     ));

  console.log(element?.tageName, element?.textContent);
  if (!element?.tagName) {
    console.log("element...", element);
    return element?.textContent || element;
  }

  console.log(
    element.tagName,
    element?.childNodes?.length,
    element.innerHTML.element?.childNodes
  );

  if (element.tagName && element.tagName === "INPUT") {
    return (
      <InputTagViewer
        state={state}
        setState={setState}
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
  } else if (children.length === 0) {
    return element;
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

        console.log(styleVal);
        newAttribute[item.name] = { ...styleVal };
      } else newAttribute[item.name] = item.value;
    });
    console.log(newAttribute);
    let newEle;
    if (children?.length > 0) {
      newEle = React.createElement(
        clonedElement.tagName.toLowerCase(),
        { ...newAttribute },
        children
      );
    } else {
      return element;
    }

    return newEle;
    // return <div dangerouslySetInnerHTML={{ __html: element.outerHTML }}></div>;
  }
}
