import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";

const PageExtension = Node.create({
  name: "pageview",

  group: "block",

  content: "block*",

  addAttributes() {
    return {
      class: {
        default: "pageview",
      },
      pageno: { default: 1 },
      contenteditable: {
        default: true,
      },
      style: {
        default:
          // "background: white;display: block;margin: 0 auto; margin-bottom: 0.5cm;box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);width: 21cm;height: 29.7cm;",
          "background: white;display: block;margin: 0 auto; margin-bottom: 0.5cm;box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);",
        parseHTML: (element) => element.getAttribute("style"),
        // … and customize the HTML rendering.
        renderHTML: (attributes) => {
          return {
            style: attributes.style,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "div.pageview",
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

export default PageExtension;
