import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import ImageTiptap from "../TipttapComponents/ImageTiptap";

export default Node.create({
  name: "customImage",

  group: "block",

  addAttributes() {
    return {
      path: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "custom-image",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["custom-image", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageTiptap);
  },
});
