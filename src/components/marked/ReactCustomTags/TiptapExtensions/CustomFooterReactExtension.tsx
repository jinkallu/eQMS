import {
  NodeViewContent,
  NodeViewWrapper,
  useCurrentEditor,
} from "@tiptap/react";

import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import React, { useEffect, useRef, useState } from "react";
import useMutationObserver from "../../../../CHooks/useMutationObserver.js";
import { v4 as uuidv4 } from "uuid";
const HeaderStyle = {
  background: "white",
  display: "block",
  margin: "0 auto",
  width: "21cm",
  borderBottom: "1px dotted black",
};
const Component = (props) => {
  const { editor } = useCurrentEditor();
  const ref = useRef(null);
  //useMutationObserver(ref, changeListener);
  editor.on("update", ({ editor }) => {
    //console.log("update", editor, editor.getJSON());
  });

  function changeListener() {
    // const ele = props.editor.$nodes("div").querySelectorAll("div.header");
    // console.log(ele);
    const endPos = props.getPos();
    const firstHeading = editor.$nodes("*", { id: props.node.attrs.id });
    //console.log("before", firstHeading);
    // console.log("changed before", props.getPos());
    const jsonEditor = props.editor.getJSON();
    //console.log(jsonEditor);

    const pages = jsonEditor.content[0]?.content;
    //console.log(pages, props.node.attrs);
    let editedHeader;
    pages?.map((page) => {
      if (page?.content[0]?.attrs?.id === props.node.attrs?.id) {
        // TODO: need to check type header
        editedHeader = page.content[0]?.content;
      }
    });

    // console.log(editedHeader);
    if (editedHeader) {
      const newPages = pages?.map((page) => {
        // TODO: need to check type header
        if (page.content[0]?.attrs?.id !== props.node.attrs?.id)
          page.content[0].content = editedHeader;
        return page;
      });
      // console.log(newPages);
      jsonEditor.content[0].content = newPages;
      // console.log(jsonEditor);
      //props.editor.commands.setContent(jsonEditor);
    }

    // const endPos = props.getPos();
    // console.log("changed after", props.getPos());

    // const afterHeading = props.editor.$node("header", {
    //   id: props.node.attrs.id,
    // });
    // console.log("after", afterHeading);

    //props.editor.commands.focus(endPos);
  }

  return (
    <NodeViewWrapper
      style={HeaderStyle}
      ref={ref}
      onChange={() => console.log(ref.current)}
    >
      {/* <button onClick={addPage}>Add</button>
      <button onClick={deleteNode}>Remove</button>
      <button onClick={addPageJSON}>Add Page JSON</button> */}
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export default Node.create({
  name: "footer",

  group: "block",

  content: "block*",

  addAttributes() {
    return {
      class: {
        default: "footer",
      },
      id: { default: uuidv4() },
      contenteditable: {
        default: true,
      },
      style: {
        default:
          "background:white;display: block;margin: 0 auto; margin-bottom: 0.5cm;box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);width: 21cm; height: 300px",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.footer",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    let attrs = mergeAttributes(HTMLAttributes);
    if (node.attrs.class === "header") {
      attrs = {
        ...attrs,
        style:
          "background: white;display: block;margin: 0 auto; margin-bottom: 0.5cm;box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);width: 21cm; height: 29.7cm",
      };
    }
    return ["div", attrs, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
