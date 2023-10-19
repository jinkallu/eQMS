import React, { useState, useEffect, useRef } from "react";
import InputTagViewer from "./InputTagViewer";

export default function Viewers({ element, order, state, setState }) {
    console.log(element.tagName);
    if (element.tagName && element.tagName === "input") {
        return (
            <InputTagViewer
                state={state}
                setState={setState}
                element={element}
                order={order}
            />
        )
    }
    else if (element.tagName) {
        const clonedElement = element.cloneNode();

        // Remove the cloned element's children
        while (clonedElement.firstChild) {
            clonedElement.removeChild(clonedElement.firstChild);
        }
        return <div dangerouslySetInnerHTML={{ __html: clonedElement.outerHTML }}></div>;
    }
}