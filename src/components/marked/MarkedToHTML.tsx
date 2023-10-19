import { marked } from "marked";
import React, { useState, useEffect, useRef } from "react";
import MarkedToCustom from "./MarkedToCustom";

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

    useEffect(() => {
        if(mdstring && mdstring.trim() !== ""){
            markedToDom();
        }
    }, [mdstring]);

    return (
        <div>
            {dom && Array.from(dom.childNodes).map((item, index) => (
                dom && <MarkedToCustom key={index} element={item} />
            ))}
        </div>
    )

}
