import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";

const PageExtension = Node.create({
  name: "page",

  //group: "block",

  content: "header pageContent footer",

  addAttributes() {
    return {
      class: {
        default: "page",
      },
      contenteditable: {
        default: true,
      },
      style: {
        default:
          "background: white;display: flex;margin:0 auto;flex-direction:column; justify-content:center;align-items:center;margin: auto;padding: 2.5cm;box-shadow: 0 0 0.5cm rgba(0,0,0,0.5); width: 21cm;height: 29.7cm; overflowX: auto; boxSizing: border-box;",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.page",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    let attrs = mergeAttributes(HTMLAttributes);
    attrs = {
      ...attrs,
      style:
        "background: white;display: flex;margin:0 auto;flex-direction:column;justify-content:center;align-items:center;margin: auto;padding: 2.5cm;box-shadow: 0 0 0.5cm rgba(0,0,0,0.5); width: 21cm;height: 29.7cm; overflowX: auto; boxSizing: border-box;",
    };
    return ["div", attrs, 0];
  },
});

export default PageExtension;
