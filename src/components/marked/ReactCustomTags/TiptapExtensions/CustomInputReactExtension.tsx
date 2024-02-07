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
  name: "rInput",

  group: "block",

  content: "inline*",

  addAttributes() {
    return {
      id: {
        default: "ss",
      },
      label: {
        default: "this is a label",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "r-input",
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

  renderHTML({ HTMLAttributes }) {
    return ["r-input", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
