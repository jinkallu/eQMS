import React, { useState, useEffect, useRef } from "react";
import InputTagViewer from "./ReactCustomTags/InputTagView";
//import RenderDomTree from "./RenderDomTree";
//import MarkedToCustom from "./MarkedToCustom";
//import GenericTag from "./GenericTag";
import EndNode from "./ReactCustomTags/EndNodeView";
import ProcessFlowView from "./ReactCustomTags/ProcessFlowView/ProcessFlowView";
import MDTagView from "./ReactCustomTags/MDTagView";
import ChainedOptionTagView from "./ReactCustomTags/ChainedOptionTagView";
import SliderTagView from "./ReactCustomTags/SliderTagView";
import MatrixTagView from "./ReactCustomTags/matrix/MatrixTagView";
import LinkRecordTagView from "./ReactCustomTags/LinkRecord/LinkRecordTagView";
import DisplayTableTagView from "./ReactCustomTags/DisplayTable/DisplayTableTagView";
import TextInputTagView from "./ReactCustomTags/TextInputTagView";
import OutputTagView from "./ReactCustomTags/OutputTagView";
import ReviewTagView from "./ReactCustomTags/ReviewTagView";
import VersionTagView from "./ReactCustomTags/VersionTagView";
import DocxTagViewer from "./ReactCustomTags/DocxTagView";

export default function Viewers({ element, order, children, productId }) {
  // if (!state && order !== "last") {
  //   return <span>Loading...</span>;
  // }
  //   const childNodes =
  //     element?.childNodes?.length > 0 &&
  //     Array.from(element.childNodes).map((child, index) => (
  //       <MarkedToCustom element={child}></MarkedToCustom>
  //     ));

  // if (!element?.tagName) {
  //   console.log(element);
  //   return <EndNode element={element?.textContent || element}></EndNode>;
  // }
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

    const val = element.getAttribute("value");
    // if (id && handleChange) handleChange(id, val || "");

    return <InputTagViewer id={id} element={element} order={order} val={val} />;
  } 
  else if (element.tagName && element.tagName === "DOCX") {
    const id = element.getAttribute("id");
    return <DocxTagViewer id={id} element={element} order={order} />;
  }
  else if (element.tagName && element.tagName === "TEXTAREA") {
    const id = element.getAttribute("id");
    return <TextInputTagView id={id} element={element} order={order} />;
  } else if (element.tagName && element.tagName === "REVIEW") {
    const id = element.getAttribute("id");
    return <ReviewTagView id={id} element={element} order={order} />;
  } else if (element.tagName && element.tagName === "VERSION") {
    const id = element.getAttribute("id");
    return <VersionTagView id={id} element={element} order={order} />;
  } else if (element.tagName && element.tagName === "CHAINEDOPTION") {
    const id = element.getAttribute("id");
    return <ChainedOptionTagView id={id} element={element} order={order} />;
  } else if (element.tagName && element.tagName === "OUTPUT") {
    const id = element.getAttribute("id");
    return <OutputTagView id={id} element={element} order={order} />;
  } else if (element.tagName && element.tagName === "LINKRECORD") {
    const id = element.getAttribute("id");
    return (
      <LinkRecordTagView
        id={id}
        element={element}
        order={order}
        productId={productId}
      />
    );
  } else if (element.tagName && element.tagName === "DISPLAYTABLE") {
    const id = element.getAttribute("id");
    return <DisplayTableTagView id={id} element={element} order={order} />;
  }
  // else if (element.tagName && element.tagName === "DISPLAYTABLE") {
  //   const id = element.getAttribute("id");
  //   return (
  //     <DisplayTableTagView
  //       state={state}
  //       id={id}
  //       handleChange={handleChange}
  //       element={element}
  //       order={order}
  //     />
  //   );
  // }
  else if (element.tagName && element.tagName === "SLIDER") {
    const id = element.getAttribute("id");
    return <SliderTagView id={id} element={element} order={order} />;
  } else if (element.tagName && element.tagName === "MATRIX") {
    const id = element.getAttribute("id");
    return <MatrixTagView id={id} element={element} order={order} />;
  } else if (element.tagName && element.tagName === "BODY") {
    return <div>{children}</div>;
  } else if (element.tagName && element.tagName === "GROUPING") {
    return <>{children}</>;
  } else if (element.tagName && element.tagName === "MD") {
    const id = element.getAttribute("id");
    return (
      <MDTagView id={id} element={element} order={order} children={children} />
    );
  } else if (element.tagName && element.tagName === "SECTION") {
    const id = element.getAttribute("id");
    if (order == "last") {
      return (
        <MDTagView
          id={id}
          element={element}
          order={order}
          children={children}
        />
      );
    }
  } else if (element.tagName && element.tagName === "P") {
    // if (children?.length === 1) {
    //   return children;
    // }
    return <p>{children}</p>;
  } else if (element.tagName && element.tagName === "PARSERERROR") {
    return <div>Error</div>;
  } else if (element.tagName && element.tagName === "PROCESSFLOW") {
    const id = element.getAttribute("id");

    return (
      <ProcessFlowView
        element={element}
        order={order}
        id={id}
        key={id}
      ></ProcessFlowView>
    );
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
      //return <EndNode element={element?.textContent || element}></EndNode>;
    }

    return newEle;
    // return <div dangerouslySetInnerHTML={{ __html: element.outerHTML }}></div>;
  }
}
