import { marked } from "marked"; // Import marked without curly braces
import React, { useState } from "react";
import { Grid } from "@mui/material";


import useMarkedAzureSDK from "./useMarkedAzureSDK";

function useMarkdToHTML() {
  const [loadingHTML, setLoadingHTML] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [htmlEditorReady, setHtmlEditorReady] = useState(false);

  const { registerAllCustomTags, parseCustomTags } = useMarkedAzureSDK();

  //const markedAzureSDK_viewer = new MarkedAzureSDK();
  //const markedAzureSDK_editor = new MarkedAzureSDK();

  const parseMarkdownToHTMLString = (markdownText: string) => {
    const parsedHtmlString = marked(markdownText);
    console.log(parsedHtmlString);
    return parsedHtmlString;
  };

  const parseHTMLStringToDOM = (parsedHtmlString: string): Document => {
    console.log(parsedHtmlString);
    const parser = new DOMParser();
    const doc = parser.parseFromString(parsedHtmlString, "text/html");
    console.log(doc);
    return doc;
  };

  const parseDOMCustomTags = async (
    htmlDOM: Document,
    type: number,
    inheritance: number
  ): Promise<Document | null> => {
    try {
      let result = null;
      /*if (editor) {
        result = await markedAzureSDK_editor.parseCustomTags(htmlDOM);
      }
      else {
        result = await markedAzureSDK_viewer.parseCustomTags(htmlDOM);
      }*/
      if (type === 2) {
        result = await parseCustomTags(htmlDOM, type, "HTMLEditor");
      } else {
        result = await parseCustomTags(htmlDOM, type, "");
      }
      if (result !== null) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const addToParentElement = (childHTMLDOM: Document, parentNodeId: string) => {
    const existingDiv = document.getElementById(parentNodeId); //'markedHTMLViewer');
    if (!existingDiv) {
      return;
    }
    existingDiv.innerHTML = "";
    Array.from(childHTMLDOM.body.childNodes).forEach((node) => {
      existingDiv.appendChild(node);
    });
  };

  const convL0MDEditToString = (markdown: string, htmlDOM: Document) => {
    //const regex = /<md level=1((?!<\/md>)[\s\S]|<\/md>)*<\/md>/g;
    //const regex = /<md([^>]*\slevel=1[^>]*)>((?!<\/md>)[\s\S]|<\/md>)*<\/md>/g;
    //const regex = /<md[^>]*\slevel=1[^>]*>((?!<\/md>)[\s\S]*?)<\/md>/g;
    //const regex = /<md[^>]*\slevel=1[^>]*>((?!<\/md>)[\s\S]*?)<\/md>/g;

    //const matches = markdown.match(regex); // Matched <md level=1> ... </md>

    //const regex = /<md[^>]*\slevel=1[^>]*>((?:[^<]+|<(?!\/?md>))*)(<\/md>)/g;
    //const regex = /<md[^>]*\slevel=1[^>]*>((?:(?!<\/?md\b)[\s\S])*(?:(?:<md[^>]*>)((?:(?!<\/?md\b)[\s\S])*)<\/md>)(?:(?!<\/?md\b)[\s\S])*)<\/md>/g;
    //const regex = /<md[^>]*\slevel=1[^>]*>((?:[^<]*(?:(?!<\/md>)<[^<]*)*)<\/md>)/g;
    //const regex = /<md[^>]*\slevel=1[^>]*>((?:[^<]*(?:(?!<\/md>)<[^<]*)*)<\/md>)/g;

    const matches = [];

    const regex = /<md[^>]*\slevel=1[^>]*>/g;
    const mdOpenMatches = markdown.match(regex);

    if (mdOpenMatches) {
      mdOpenMatches.forEach((openingTag) => {
        let openPosition = markdown.indexOf(openingTag);

        // Step 2: Search for the next </md> tag
        if (openPosition !== -1) {
          let openTags = 1;
          let closeTags = 0;
          let currentPosition = openPosition;
          let closePosition = null;
          while (openTags !== closeTags && closePosition !== -1) {
            closePosition = markdown.indexOf("</md>", currentPosition + 1);

            if (closePosition !== -1) {
              closeTags += 1;
              // Step 3: Check if there is an <md> open tag in between
              const substring = markdown.substring(
                currentPosition + 1,
                closePosition
              );
              const nestedMatches = substring.match(/<md[^>]*>/g);

              if (nestedMatches) {
                openTags += nestedMatches.length;
                currentPosition = closePosition;
              }
            }
          }
          if (closePosition !== null) {
            const matchedContent = markdown.substring(
              openPosition,
              closePosition + 6
            );
            matches.push(matchedContent);
          }
        }
      });
    }
    /*
          const regex = /<md[^>]*\slevel=1[^>]*>((?:(?!<\/md>)[\s\S])*?)<\/md>/g;
    
    
        const matches = [];
    
        let match;
        while ((match = regex.exec(markdown)) !== null) {
          matches.push(match[0]);
        }*/

    const mdElements = htmlDOM.querySelectorAll('md[level="1"]'); // find md elements from DOM

    for (let i = 0; i < matches.length; i++) {
      for (let j = 0; j < mdElements.length; j++) {
        const match = matches[i];
        const mdElement = mdElements[j];

        const parser = new DOMParser();
        const doc = parser.parseFromString(match, "text/html");

        const matchEle = doc.querySelector("md");

        const mdId = mdElement.getAttribute("id");
        const matchId = matchEle.getAttribute("id");

        if (mdId === matchId) {
          while (mdElement.firstChild) {
            mdElement.removeChild(mdElement.firstChild);
          }
          // remove level 1 md from string
          const openingTagRegex = /<md level=1[^>]*>/;
          const closingTagRegex = /<\/md>/g;

          const openingMatch = match.match(openingTagRegex);
          //const closingMatch = match.match(closingTagRegex);

          // Find all closing tag positions in the string
          const closingTagPositions = [];

          if (openingMatch) {
            const openingTag = openingMatch[0];
            //const closingTag = closingMatch[0];

            // Remove the first opening tag and the corresponding closing tag
            const match_removed = match.replace(openingTag, "");

            let match_tmp;
            while ((match_tmp = closingTagRegex.exec(match_removed)) !== null) {
              closingTagPositions.push(match_tmp.index);
            }

            if (closingTagPositions.length >= 1) {
              // Find the position of the last closing tag
              const lastClosingTagPosition = closingTagPositions.pop();

              // Remove the last closing tag from the input string
              const result =
                match_removed.substring(0, lastClosingTagPosition) +
                match_removed.substring(lastClosingTagPosition + 5);
              mdElement.setAttribute("mdstring", result);
            }

            //mdElement.setAttribute("mdstring", );

            break;
          }
        }
      }
    }
  };

  const createHTMLViewer = (parentNodeId: string, type: number) => {
    const editDiv = document.getElementById("Editor"); //'markedHTMLViewer');
    const newDocument = document.implementation.createHTMLDocument(
      "New Document_" + type
    );
    const childNodes = editDiv.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      const clonedChildNode = childNode.cloneNode(true);
      newDocument.body.appendChild(clonedChildNode);
    }

    let mdTextAreaElements = newDocument.querySelectorAll("textarea"); // find md elements from DOM
    // replace textareas with html
    for (let i = 0; i < mdTextAreaElements.length; i++) {
      const htmlString: string = parseMarkdownToHTMLString(
        mdTextAreaElements[i].value
      );
      const htmlDOM: Document = parseHTMLStringToDOM(htmlString);

      const divElement = document.createElement("div");
      divElement.id = mdTextAreaElements[i].id.replace(/_textarea$/, "_div");

      Array.from(htmlDOM.body.childNodes).forEach((node) => {
        divElement.appendChild(node.cloneNode(true));
      });
      const parentElement = mdTextAreaElements[i].parentNode;
      parentElement?.replaceChild(divElement, mdTextAreaElements[i]);
      //let markedAzureSDK = new MarkedAzureSDK();
      /*parseDOMCustomTags(markedAzureSDK, htmlDOM, type, 0).then(htmlDOMCustom => {
        if (htmlDOMCustom !== null) {
          // Now you can work with htmlDOMCustom
          const divElement = document.createElement('div');
          divElement.id = mdTextAreaElements[i].id.replace(/_textarea$/, "_div");

          Array.from(htmlDOMCustom.body.childNodes).forEach(node => {
            divElement.appendChild(node.cloneNode(true));
          });
          const parentElement = mdTextAreaElements[i].parentNode;
          console.log(parentElement);
          parentElement?.replaceChild(divElement, mdTextAreaElements[i]);
          console.log(mdTextAreaElements[i], divElement);
          markedAzureSDK = null;
          if(type === 1){
            setHtmlEditorReady(true);
          }
          
        }
      });*/
    }
    //let markedAzureSDK = new MarkedAzureSDK();
    parseDOMCustomTags(newDocument, type, 0).then((htmlDOMCustom) => {
      if (htmlDOMCustom !== null) {
        addToParentElement(newDocument, parentNodeId);
        if (type === 1) {
          setHtmlEditorReady(true);
        }
      }
    });

    //markedAzureSDK = null;
  };
  /*
  const createHTMLViewer = (parentNodeId: string, type: number) => {
    const editDiv = document.getElementById("Editor");//'markedHTMLViewer');
    const newDocument = document.implementation.createHTMLDocument('New Document_'+type);
    const childNodes = editDiv.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      const clonedChildNode = childNode.cloneNode(true);
      newDocument.body.appendChild(clonedChildNode);
    }
    
    let mdTextAreaElements = newDocument.querySelectorAll('textarea'); // find md elements from DOM
    // replace textareas with html
    for (let i = 0; i < mdTextAreaElements.length; i++) {
      const htmlString: string = parseMarkdownToHTMLString(mdTextAreaElements[i].value);
      const htmlDOM: Document = parseHTMLStringToDOM(htmlString);
      let markedAzureSDK = new MarkedAzureSDK();
      parseDOMCustomTags(markedAzureSDK, htmlDOM, type, 0).then(htmlDOMCustom => {
        if (htmlDOMCustom !== null) {
          // Now you can work with htmlDOMCustom
          const divElement = document.createElement('div');
          divElement.id = mdTextAreaElements[i].id.replace(/_textarea$/, "_div");

          Array.from(htmlDOMCustom.body.childNodes).forEach(node => {
            divElement.appendChild(node.cloneNode(true));
          });
          const parentElement = mdTextAreaElements[i].parentNode;
          console.log(parentElement);
          parentElement?.replaceChild(divElement, mdTextAreaElements[i]);
          console.log(mdTextAreaElements[i], divElement);
          markedAzureSDK = null;
          if(type === 1){
            setHtmlEditorReady(true);
          }
          
        }
      });

    }
    addToParentElement(newDocument, parentNodeId);

  }
  */

  const textAreaUpdate = (textarea: HTMLTextAreaElement) => {};

  function markedToDom(markdown) {
    const html: string = parseMarkdownToHTMLString(markdown);

    const dom = parseHTMLStringToDOM(html);
    console.log(dom);
    return dom?.body?.firstChild;
  }

  const markdToCustom = (
    dom: boolean,
    markdown: string,
    parentNodeId: string,
    type: number,
    inheritance: number,
    htmlDocument: Document
  ) => {
    let htmlDOM: Document = null;
    if (!dom) {
      const htmlString: string = parseMarkdownToHTMLString(markdown);
      htmlDOM = parseHTMLStringToDOM(htmlString);
      console.log(htmlDOM);
    } else {
      htmlDOM = htmlDocument;
      console.log("else", htmlDOM);
    }

    if (type === 0) {
      setEditorReady(false);
      convL0MDEditToString(markdown, htmlDOM);
      //const htmlDOMCustom = parseDOMCustomTags(htmlDOM);
      //let markedAzureSDK = new MarkedAzureSDK();
      parseDOMCustomTags(htmlDOM, type, inheritance).then((htmlDOMCustom) => {
        if (htmlDOMCustom !== null) {
          // Now you can work with htmlDOMCustom
          addToParentElement(htmlDOMCustom, parentNodeId);
          //markedAzureSDK = null;
          setEditorReady(true);
        }
      });
    } else if (type === 1 || type === 2) {
      if (type === 1) {
        setHtmlEditorReady(false);
      }
      createHTMLViewer(parentNodeId, type);
    } else if (type === 3) {
      // main qms viewer
      //const htmlString: string = parseMarkdownToHTMLString(markdown);
      //let htmlDOM: Document = parseHTMLStringToDOM(htmlString);
      const mdTags = htmlDOM.getElementsByTagName("md");
      for (let i = 0; i < mdTags.length; i++) {
        let parentAttribute = mdTags[i].getAttribute("level");
        if (parentAttribute === null) {
          parentAttribute = "1";
        } else {
          parentAttribute = (parseInt(parentAttribute) + 1).toString();
        }
        mdTags[i].setAttribute("level", parentAttribute);
      }
      //let markedAzureSDK = new MarkedAzureSDK();
      parseDOMCustomTags(htmlDOM, 0, 0).then((htmlDOMCustom) => {
        if (htmlDOMCustom !== null) {
          addToParentElement(htmlDOM, parentNodeId);
        }
      });
      //markedAzureSDK = null;
    }
  };

  const markedToComponents = ({ marked }) => {
      const [state, setState] = React.useState("");
      return (
        <Grid container spacing={2} columns={{ xs: 12 }}>
          <Grid item xs={4}>
            <EditorEle
              state={state}
              setState={setState}
              marked={marked}
              order={"first"}
            ></EditorEle>
          </Grid>
          <Grid item xs={4}>
            <EditorEle
              state={state}
              setState={setState}
              marked={marked}
              order={"middle"}
            ></EditorEle>
          </Grid>
          <Grid item xs={4}>
            <EditorEle
              state={state}
              setState={setState}
              marked={marked}
              order={"last"}
            ></EditorEle>
          </Grid>
        </Grid>
      );
    }

    function EditorEle({ marked, order, state, setState }) {
      switch (order) {
        case "first":
          return marked;
    
          break;
    
        case "middle":
          return (
            <input value={state} onChange={(e) => setState(e.target.value)}></input>
          );
          break;
        case "last":
          return <span>{state}</span>;
        default:
          return <h1>Error</h1>;
          break;
      }
    }

  return {
    editorReady,
    htmlEditorReady,
    loadingHTML,
    markdToCustom,
    textAreaUpdate,
    registerAllCustomTags,
    markedToDom,
    markedToComponents
  };
}

export default useMarkdToHTML;
