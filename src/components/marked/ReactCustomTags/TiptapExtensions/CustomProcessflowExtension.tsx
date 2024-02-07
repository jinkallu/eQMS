import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import ProcessFlowTiptap from "../TipttapComponents/ProcessFlowTiptap";

export default Node.create({
  name: "ProcessFlow",

  group: "block",

  addAttributes() {
    return {
      id: {
        default: "ss",
      },
      test: { default: [] },
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
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "processflow",
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
    return ["processflow", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ProcessFlowTiptap);
  },
});
