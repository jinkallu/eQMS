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
      <div className={props?.node?.attrs?.class} >
        <textarea disabled value={"Extend Template. You will be able to extend this area, when you create a new document from this template."}/>
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
        default: "toextend",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.toextend",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExtendComponent);
  },
});
