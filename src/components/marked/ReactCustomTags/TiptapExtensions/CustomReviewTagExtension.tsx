import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import ReviewTagTiptap from "../TipttapComponents/ReviewTagTipttap";

export default Node.create({
  name: "Review",

  group: "block",

  addAttributes() {
    return {
      id: {
        default: "review",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "review",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["review", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ReviewTagTiptap);
  },
});
