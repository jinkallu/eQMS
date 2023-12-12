import React, { useState, useEffect, useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import MarkedToCustom from "../MarkedToCustom";
import Box from "@mui/material/Box";

export default function MDTagView({
  element,
  order,
  state,
  id,
  handleChange,
  children,
}) {
  const [markedData, setMarkedData] = React.useState<string>();
  useEffect(() => {
    if (id) {
      if (!state || !state[id]) handleChange(id, "");
    }
  }, [id]);
  function handleChangeEditor(value, event) {
    if (handleChange) {
      handleChange(id, value);
    }
  }

  let parentAttribute = element.getAttribute("level");
  if (parentAttribute === null) {
    parentAttribute = "0";
    element.setAttribute("level", parentAttribute);
  }

  let component;
  switch (order) {
    case "first":
      if (parentAttribute === "0") {
        component = <textarea>{children}</textarea>;
        //const mdElement = document.createElement('textarea');
        //mdElement.rows = 10;
        //mdElement.style.width = "100%";
        //mdElement.placeholder = "Placeholder for Markdown text...";
        //mdElement.readOnly = true;
        //mdElement.setAttribute('type', "md");
      } else if (parentAttribute === "1") {
        //const value = element.getAttribute('mdstring');
        const textareaStyle = {
          width: "100%", // Set the desired height here
        };
        //const  value=state[id];
        //setMarkedData(value);

        component = (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Editor
              height="75vh"
              defaultLanguage="html"
              defaultValue={element.innerHTML}
              value={state[id]}
              onChange={handleChangeEditor}
            />
          </Box>
        );

        //component = <textarea id={id} defaultValue={element.innerHTML} rows={10} value={state[id]} style={textareaStyle} onChange={handleChangeEditor}></textarea>
        //while (element.firstChild) {
        //    element.removeChild(element.firstChild);
        //  }
        //const mdElement = document.createElement('textarea');
        //mdElement.id = element.id + '_textarea';
        //mdElement.rows = 10;
        //mdElement.style.width = "100%";
        //mdElement.setAttribute('type', "md");
      } else {
        component = <div>{children}</div>;
      }
      //component = <div>{children}</div>;
      break;
    // case "middle":
    //   component = <div>{children}</div>;
    //   break;
    case "middle":
    case "last":
      try {
        // parentAttribute = element.getAttribute("level");
        // if (parentAttribute === null) {
        //   parentAttribute = "0";
        //   element.setAttribute("level", parentAttribute);
        // }
        if (parentAttribute === "0") {
          component = (
            <textarea
              readOnly={true}
              rows={50}
              placeholder={"Editer for the future inherited documents"}
              style={{ width: "100%" }}
            ></textarea>
          );
        } else if (parentAttribute === "1") {
          let htmlString;
          if (state) {
            if (state[id]) {
              htmlString = state[id];
            } else {
              htmlString = element.innerHTML;
            }
          } else {
            htmlString = element.innerHTML;
          }
          //htmlString = state[id] || element.innerHTML; // We are not getting the string from textarea here
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlString, "text/html");
          //console.log(doc);
          /*const divElement = document.createElement('div');
                  const bodyChildren = Array.from(doc.body.children);
                  bodyChildren.forEach(child => {
                      divElement.appendChild(child);
                  });*/

          component = (
            <MarkedToCustom
              element={doc.body}
              open={open}
              setOpen={null}
              order={order}
              state={state}
              handleChange={handleChange}
            ></MarkedToCustom>
          );
        } else {
          component = <div>{children}</div>;
        }
        /* const htmlString = "TEST";//state[id]; // We are not getting the string from textarea here
               const parser = new DOMParser();
               const doc = parser.parseFromString(htmlString, "text/html");
               const divElement = document.createElement('div');
               const bodyChildren = Array.from(doc.body.children);
               bodyChildren.forEach(child => {
                   divElement.appendChild(child);
               });
               console.log(doc);
   
               component = <MarkedToCustom
                   element={doc.body}
                   open={open}
                   setOpen={null}
                   order="last"
                   state={state}
                   handleChange={handleChange}
               ></MarkedToCustom>
               console.log("MD")*/

        //component = <div>{state[id]}</div>
        //console.log(tempcomponent);
      } catch (error) {
        component = <div>Error</div>;
        console.log(error);
      }
      break;

    default:
      component = <span>"Error";</span>;
      break;
  }
  return component;
}
