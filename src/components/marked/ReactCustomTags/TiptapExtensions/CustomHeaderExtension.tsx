import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";

const HeaderExtension = Node.create({
  name: "header",

  group: "block",

  content: "block*",

  addAttributes() {
    return {
      class: {
        default: "header",
      },
      contenteditable: {
        default: true,
      },
      style: {
        default: "border-bottom: 1px solid black; margin-bottom: 20px;",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.header",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    let attrs = mergeAttributes(HTMLAttributes);
    // if (node.attrs.class === "extend") {
    //   attrs = {
    //     ...attrs,
    //     style: "border: 1px solid green; margin-bottom: 3px; height:500px",
    //   };
    // } 
    return ["div", attrs, 0];
  },
});

export default HeaderExtension;
