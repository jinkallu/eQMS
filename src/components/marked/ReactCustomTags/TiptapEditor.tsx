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
import CustomInputReact from "./TiptapExtensions/CustomInputReactExtension";
import CustomExtend from "./CustomExtend";
import Heading from "@tiptap/extension-heading";
import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";
import { NodePos } from "@tiptap/react"; // Make sure to import NodePosition
import ExtendExtension from "./TiptapExtensions/CustomExtendExtension";
import NonEditableExtension from "./TiptapExtensions/CustomNonEditableExtension";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import ProcessFlowExtension from "./TiptapExtensions/CustomProcessflowExtension";
import ReviewTagViewExtension from "./TiptapExtensions/CustomReviewTagExtension";
import HeaderExtension from "./TiptapExtensions/CustomHeaderExtension";
import {
  CustomTableNode,
  tableRow,
  tableCell,
} from "./TiptapExtensions/CustomTableExtension";
import "./TiptapEditor.css";
import { Box } from "@mui/material";

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
  ProcessFlowExtension,
  ReviewTagViewExtension,
  HeaderExtension,
  //customTableNode,
  //tableRow,
  //tableCell
];

// const content = "<p>Hello World!</p>";

const TiptapEditor = ({ content, editMode }) => {
  const { templateState } = useExtnStore((state) => state);

  return (
    <EditorProvider
      extensions={extensions}
      //content={templateState[id] || " "}
      content={content || " "}
      //content={editor?.getHTML()}
      slotBefore={editMode && <TiptapMenuBar />}
      editable={editMode}
    >
      {""}
    </EditorProvider>
  );
};

export default TiptapEditor;
