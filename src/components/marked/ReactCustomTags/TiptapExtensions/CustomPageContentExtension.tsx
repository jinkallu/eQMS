import {
  NodeViewContent,
  NodeViewWrapper,
  useCurrentEditor,
} from "@tiptap/react";

import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import TiptapInputDialog from "../TiptapInputDialog";
import { useIsOverflow } from "../../../../CHooks/useIsOverflow";
import { EditorState } from "@tiptap/pm/state";
import { v4 as uuidv4 } from "uuid";
const StyleA4 = {
  background: "white",
  display: "block",
  margin: "0 auto",
  width: "21cm",
  flexGrow: 1,
};
const Component = (props) => {
  return (
    <NodeViewWrapper style={StyleA4}>
      {/* <button onClick={addPage}>Add</button>
      <button onClick={deleteNode}>Remove</button>
      <button onClick={addPageJSON}>Add Page JSON</button> */}
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export default Node.create({
  name: "pagecontent",

  //group: "block",

  content: "block*",

  addAttributes() {
    return {
      version: {
        default: -1,
      },
      id: { default: uuidv4() },
      class: {
        default: "pagecontent",
      },
      contenteditable: {
        default: true,
      },
      style: {
        default:
          "background:white;display: block;margin: 0 auto; margin-bottom: 0.5cm;box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);width: 21cm; ",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.pagecontent",
      },
    ];
  },

  // addKeyboardShortcuts() {
  //   return {
  //     "Mod-Enter": () => {
  //       return this.editor
  //         .chain()
  //         .insertContentAt(this.editor.state.selection.head, {
  //           type: this.type.name,
  //         })
  //         .focus()
  //         .run();
  //     },
  //   };
  // },

  renderHTML({ node, HTMLAttributes }) {
    let attrs = mergeAttributes(HTMLAttributes);
    if (node.attrs.class === "pagecontent") {
      attrs = {
        ...attrs,
        style:
          "background: white;display: block;margin: 0 auto; margin-bottom: 0.5cm;box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);width: 21cm; ",
      };
    }
    // } else if (node.attrs.class === "non-extend") {
    //   attrs = {
    //     ...attrs,
    //     style: "border: 1px solid red; margin-bottom: 3px",
    //   };
    // }
    return ["div", attrs, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
