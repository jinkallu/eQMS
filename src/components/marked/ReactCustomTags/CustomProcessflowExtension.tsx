import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import ProcessFlowTiptap from "./ProcessFlowView/ProcessFlowTiptap";

export default Node.create({
  name: "Processflow",

  group: "block",

  content: "block*",

  addAttributes() {
    return {
      id: {
        default: "ss",
      },
      nodes: {
        default: [],

        parseHTML: (element) => element.getAttribute("data-nodes"),
        // … and customize the HTML rendering.
        renderHTML: (attributes) => {
          return {
            "data-nodes": attributes.nodes,
          };
        },
      },
      edges: {
        default: [],

        parseHTML: (element) => element.getAttribute("data-edges"),
        // … and customize the HTML rendering.
        renderHTML: (attributes) => {
          return {
            "data-edges": attributes.edges,
          };
        },
      },
      editable: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "process-flow",
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
    return ["process-flow", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ProcessFlowTiptap);
  },
});

const Component = () => {
  return (
    <div>
      <h1>Test processflow</h1>
    </div>
  );
};
