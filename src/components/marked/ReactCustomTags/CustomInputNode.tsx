import { Node } from '@tiptap/core';

const CustomInputNode = Node.create({
    name: 'custom_input',
    group: 'inline',
    inline: true,
    content: 'text*', // Allow inline text content

    addAttributes() {
        return {
            // Define any custom attributes here
            id: { default: null },
        }
    },
    parseHTML() {
        return [
            {
                tag: 'input',
            }
        ];
    },
    renderHTML({ node, HTMLAttributes }) {
        return ['input', HTMLAttributes, 0];
    },
});

export default CustomInputNode;