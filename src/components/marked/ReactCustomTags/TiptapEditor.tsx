import {
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
  useCurrentEditor,
  useEditor 
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useExtnStore } from "../../../zustand/store";
import { customTableNode } from "./CustomTableNode";
import CustomInputNode from "./CustomInputNode";
import { TiptapMenuBar } from "./TiptapMenubar";
import CustomInputReact from "./CustomInputReactExtension";
import CustomExtend from "./CustomExtend";
import Heading from '@tiptap/extension-heading';
import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from 'prosemirror-state';
import { Extension } from '@tiptap/core';




const CustomH1 = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,//'user-select: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; pointer-events: none;',
      },
      'data-editable': {
        default: true,
      },
      contenteditable: {
        default: false,
      },
    }
  },
});

const Extend =  Node.create({
  name: "extend",

  group: "block",

  content: "block*",

  addAttributes() {
    return {
      class: {
        default: "extend",
      },
      contenteditable: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.extend',
      },
      {
        tag: 'div.non-extend',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    let attrs = mergeAttributes(HTMLAttributes);
    if (node.attrs.class === 'non-extend') {
      attrs = { ...attrs, contenteditable: 'false' };
    }
    return ['div', attrs, 0];
  },
});

const key = new PluginKey('nonEditable');

const nonEditablePlugin = new Plugin({
  key,
  
  props: {
    handleDOMEvents: {
      handleClick: (view, event) => {
        console.log("mouse click");
        const { state } = view;
        const { $from } = state.selection;
        const node = $from.node();
        if (node && node.attrs.class === 'non-extend') {
          event.preventDefault();
          return true;
        }
        return false;
      },
      keypress: (view, event) => {
        console.log("key click");
        const { state } = view;
        const { $from } = state.selection;
        const parentNode = $from.parent;
        const node = $from.node();
        console.log(node);
        console.log(parentNode);
        if (parentNode && parentNode.attrs.class === 'non-extend') {
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
  },
});

const NonEditableExtension = Extension.create({
  name: 'nonEditable',
  addProseMirrorPlugins() {
    return [
      nonEditablePlugin,
    ];
  },
});

// define your extension array
const extensions = [
  StarterKit,
  CustomInputNode,
  customTableNode.table,
  customTableNode.table_row,
  customTableNode.table_cell,
  CustomInputReact,
  //CustomExtend,
  CustomH1,
  Extend,
  NonEditableExtension
];

// const content = "<p>Hello World!</p>";

const TiptapEditor = ({ content }) => {
  const { templateState } = useExtnStore((state) => state);
  

  return (
    <EditorProvider
      extensions={extensions}
      //content={templateState[id] || " "}
      content={content || " "}
      //content={editor?.getHTML()}
      slotBefore={<TiptapMenuBar />}
      //editable={false}
    >
      {""}
    </EditorProvider>
  );
};

const InsertCustomInputButton = () => {
  const { editor } = useCurrentEditor();

  const insertCustomInput = () => {
    editor
      .chain()
      .focus()
      .insertContent({ type: "custom_input", attrs: { id: "testInput" } })
      .run();
    //const node = editor.schema.nodes.custom_input.create({ id: 'testInput' });
    //console.log(node);
    //editor.chain().focus().insertContent(node).run();
  };

  return <button onClick={insertCustomInput}>Insert Custom Input</button>;
};

export default TiptapEditor;
