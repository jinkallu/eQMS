import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import React, { useState } from "react";

const ExtendComponent = (props) => {
  const [open, setOpen] = useState(false);

  function addInput(id) {
    props.updateAttributes({ id: id });
    setOpen(false);
  }
  return (
    <NodeViewWrapper className="react-component-with-content">
      <div className={props?.node?.attrs?.class} contentEditable={props?.node?.attrs?.contenteditable}>
        <h1>Extendable Area</h1>
      </div>

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
      class: {
        default: "extend",
      },
      contenteditable: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "divextend",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["divextend", mergeAttributes(HTMLAttributes), 0];
  },

  // addNodeView() {
  //   return ReactNodeViewRenderer(ExtendComponent);
  // },
});
