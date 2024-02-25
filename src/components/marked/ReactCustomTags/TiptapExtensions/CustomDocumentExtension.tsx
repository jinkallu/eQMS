import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import ReviewTagTiptap from "../TipttapComponents/ReviewTagTipttap";

const Document = Node.create({
    name: "doc",
    topNode: true,
    content: 'extend+',
});

const Paragraph = Node.create({
    name: "paragraph",
    group: "block",
    content: "inline*",
    parseHTML() {
        return [{ tag: 'p' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['p', HTMLAttributes, 0];
    },
});

const Text = Node.create({
    name: "text",
    group: "inline",
});

export { Document, Paragraph, Text }
