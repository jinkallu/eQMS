import { mergeAttributes, Node } from "@tiptap/core";

const CustomTableNode = Node.create({
    name: "table",
    group: 'block',
    content: 'table_row+',
    addAttributes() {
        return {
            style: { default: null },
        }
    },
    parseHTML() {
        return [
            {tag: "table"}
        ];
    },
    renderHTML({ HTMLAttributes }) {
        let attrs = mergeAttributes(HTMLAttributes);
        return ["table", attrs, 0];
    },
});

const tableRow = Node.create({
    name: "table_row",
    content: 'table_cell+',
    addAttributes() {
        return {
            style: { default: null },
        }
    },
    parseHTML() {
        return [
            {tag: "tr"}
        ];
    },
    renderHTML({ HTMLAttributes }) {
        let attrs = mergeAttributes(HTMLAttributes);
        return ["tr", attrs, 0];
    },
});

const tableCell = Node.create({
    name: "table_cell",
    content: 'inline',
    addAttributes() {
        return {
            style: { default: null },
        }
    },
    parseHTML() {
        return [
            {tag: "td"}
        ];
    },
    renderHTML({ HTMLAttributes }) {
        let attrs = mergeAttributes(HTMLAttributes);
        return ["td", attrs, 0];
    },
});


export { CustomTableNode, tableRow, tableCell };
