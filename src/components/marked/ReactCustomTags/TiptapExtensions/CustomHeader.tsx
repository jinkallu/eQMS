import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";

const HeaderExtension = Node.create({
  name: "header",

  //group: "block",

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
        default: "background:white;display: block;margin: 0 auto; ",
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

    attrs = {
      ...attrs,
      style: "background:white;display: block;margin: 0 auto; ",
    };

    return ["div", attrs, 0];
  },
});

export default HeaderExtension;
