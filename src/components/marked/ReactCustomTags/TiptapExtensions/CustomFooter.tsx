import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";

const FooterExtension = Node.create({
  name: "footer",

  //group: "block",

  content: "block*",

  addAttributes() {
    return {
      class: {
        default: "footer",
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
        tag: "div.footer",
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

export default FooterExtension;
