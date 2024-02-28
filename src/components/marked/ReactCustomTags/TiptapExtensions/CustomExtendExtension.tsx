import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";

const ExtendExtension = Node.create({
  name: "extend",

  //group: "block",

  content: "page+",

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
        default: "border: 1px solid green; min-height:100vh; overflow:auto",
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

  renderHTML({ node, HTMLAttributes }) {
    let attrs = mergeAttributes(HTMLAttributes);
    if (node.attrs.class === "extend") {
      attrs = {
        ...attrs,
        style:
          "border: 1px solid green; margin-bottom: 3px; min-height:100vh; overflow:auto",
      };
    } else if (node.attrs.class === "non-extend") {
      attrs = {
        ...attrs,
        style: "border: 1px solid red; margin-bottom: 3px",
      };
    }
    return ["div", attrs, 0];
  },
});

export default ExtendExtension;
