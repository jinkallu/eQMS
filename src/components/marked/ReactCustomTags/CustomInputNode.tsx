import { mergeAttributes, Node } from '@tiptap/core';

const CustomInputNode = Node.create({
    name: 'custom_input',
    group: 'block',
    //inline: true,
    //content: 'text*', // Allow inline text content
    parseHTML() {
      return [{ tag: 'input' }];
    },
    renderHTML({ HTMLAttributes }) {
      return ['input', HTMLAttributes, 0];
    },
  });
  
  export default CustomInputNode;