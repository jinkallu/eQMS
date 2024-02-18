import { mergeAttributes, Node } from '@tiptap/core';

const CustomTableNode = Node.create({
    name: 'table',
    group: 'block',
    content: 'table_row+',
    addAttributes() {
        return {
            style: { default: null }, // Add a style attribute
        }
    },
    parseHTML() {
        return [
            {
                tag: 'table',
            }
        ];
    },
    renderHTML({ node, HTMLAttributes }) {
        return ['table', mergeAttributes({ style: node.attrs.style || '' }, HTMLAttributes), 0];
    },
});

const CustomTableRowNode = Node.create({
    name: 'table_row',
    group: 'table_row',
    content: 'table_cell+',
    addAttributes() {
        return {
            style: { default: null }, // Add a style attribute
        }
    },
    parseHTML() {
        return [
            { tag: 'tr' },
        ];
    },
    renderHTML({ node, HTMLAttributes }) {
        return ['tr', mergeAttributes({ style: node.attrs.style || '' }, HTMLAttributes), 0];
    },
});

const CustomTableCellNode = Node.create({
    name: 'table_cell',
    group: 'table_cell',
    content: 'block',
    addAttributes() {
        return {
            style: { default: null }, // Add a style attribute
        }
    },
    parseHTML() {

        return [
            {
                tag: 'td',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['td', { ...HTMLAttributes, style: HTMLAttributes.style }, 0];
    },
});

export const customTableNode = {
    table: CustomTableNode,
    table_row: CustomTableRowNode,
    table_cell: CustomTableCellNode,
};
