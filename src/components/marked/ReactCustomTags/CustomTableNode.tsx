import { mergeAttributes, Node } from '@tiptap/core';

const CustomTableNode = Node.create({
    name: 'table',
    group: 'block',
    content: 'table_row+',
    attrs: {
        style: { default: null }, // Add a style attribute
    },
    parseHTML() {
        return [
            {
                tag: 'table',
                getAttrs(dom) {
                    return {
                        style: dom.style.cssText || null,
                    };
                },
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
    attrs: {
        style: { default: null }, // Add a style attribute
    },
    parseHTML() {
        return [
            { tag: 'tr', getAttrs: (dom) => ({ style: dom.getAttribute('style') || null }) },
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
    attrs: {
        style: { default: 'border: 1px solid black;' }, // Add a style attribute
    },
    parseHTML(element) {
        console.log('Parsing HTML:', element);

        return [
            {
              tag: 'td',
              getAttrs: (dom) => ({ style: dom.getAttribute('style') }),
            },
          ];
    },
    
    renderHTML({ HTMLAttributes }) {
        return ['td',  {...HTMLAttributes, style: HTMLAttributes.style}, 0];
    },
});

export const customTableNode = {
    table: CustomTableNode,
    table_row: CustomTableRowNode,
    table_cell: CustomTableCellNode,
};
