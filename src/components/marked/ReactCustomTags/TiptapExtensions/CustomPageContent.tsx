import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";

const PageContentExtension = Node.create({
  name: "pageContent",

  //group: "block",

  content: "block*",

  addAttributes() {
    return {
      class: {
        default: "pageContent",
      },
      contenteditable: {
        default: true,
      },
      style: {
        default: "background:white;display: block;width:100%;flex-grow:1 ",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.pageContent",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    let attrs = mergeAttributes(HTMLAttributes);
    attrs = {
      ...attrs,
      style: "background:white;display: block;width:100%;flex-grow:1 ",
    };
    return ["div", attrs, 0];
  },
});

export default PageContentExtension;
