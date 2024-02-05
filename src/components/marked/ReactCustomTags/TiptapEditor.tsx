import {
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
  useCurrentEditor,
  useEditor,
  EditorContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useExtnStore } from "../../../zustand/store";
import { customTableNode } from "./CustomTableNode";
import CustomInputNode from "./CustomInputNode";
import { TiptapMenuBar } from "./TiptapMenubar";
import CustomInputReact from "./CustomInputReactExtension";
import CustomExtend from "./CustomExtend";
import Heading from "@tiptap/extension-heading";
import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";
import { NodePos } from "@tiptap/react"; // Make sure to import NodePosition
import ExtendExtension from "./CustomExtendExtension";
import NonEditableExtension from "./CustomNonEditableExtension";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

const CustomH1 = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null, //'user-select: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; pointer-events: none;',
      },
      "data-editable": {
        default: false,
      },
      contenteditable: {
        default: false,
      },
    };
  },
});

// define your extension array
const extensions = [
  StarterKit,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  CustomInputNode,
  // customTableNode.table,
  // customTableNode.table_row,
  // customTableNode.table_cell,
  CustomInputReact,
  //CustomExtend,
  //CustomH1,
  ExtendExtension,
  NonEditableExtension,
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
