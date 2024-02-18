import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import React, { useState } from "react";
import TiptapInputDialog from "../TiptapInputDialog";

const Component = (props) => {
  const [open, setOpen] = useState(false);

  function addInput(id) {
    props.updateAttributes({ id: id });
    setOpen(false);
  }
  return (
    <NodeViewWrapper className="react-component-with-content">
      <span>Purpose</span>
      <TiptapInputDialog
        addInput={addInput}
        open={open}
        setOpen={setOpen}
      ></TiptapInputDialog>
      <input disabled id={props?.node?.attrs?.id} />
      <button onClick={() => setOpen(true)}> edit</button>

      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default Node.create({
  name: "extend",

  group: "block",

  content: "block*",

  addAttributes() {
    return {
      version: {
        default: -1,
      },
      class: {
        default: "extend",
      },
      contenteditable: {
        default: true,
      },
      style: {
        default: "border: 1px solid green",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.extend",
      },
      {
        tag: "div.non-extend",
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
    if (node.attrs.class === "extend") {
      attrs = {
        ...attrs,
        style: "border: 1px solid green; margin-bottom: 3px; height:500px",
      };
    } else if (node.attrs.class === "non-extend") {
      attrs = {
        ...attrs,
        style: "border: 1px solid red; margin-bottom: 3px",
      };
    }
    return ["div", attrs, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
