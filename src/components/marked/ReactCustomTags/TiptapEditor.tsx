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
//import { customTableNode } from "./CustomTableNode";
//import CustomInputNode from "./CustomInputNode";
import { TiptapMenuBar } from "./TiptapMenubar";
import CustomInputReact from "./TiptapExtensions/CustomInputReactExtension";
//import CustomExtend from "./CustomExtend";
import Heading from "@tiptap/extension-heading";
import { Node } from "@tiptap/core";
//import { Plugin, PluginKey } from "prosemirror-state";
//import { Extension } from "@tiptap/core";
//import { NodePos } from "@tiptap/react"; // Make sure to import NodePosition
import ExtendExtension from "./TiptapExtensions/CustomExtendExtension";
import NonEditableExtension from "./TiptapExtensions/CustomNonEditableExtension";
//import Table from "@tiptap/extension-table";
//import TableCell from "@tiptap/extension-table-cell";
//import TableHeader from "@tiptap/extension-table-header";
import {
  Document,
  Paragraph,
  Text,
} from "./TiptapExtensions/CustomDocumentExtension";
// import TableRow from "@tiptap/extension-table-row";
import {
  CustomTableRow,
  CustomTableCell,
  CustomTableHeader,
  CustomTable,
} from "./TiptapExtensions/CustomTiptapTableExtension";
// import ProcessFlowExtension from "./TiptapExtensions/CustomProcessflowExtension";
// import ReviewTagViewExtension from "./TiptapExtensions/CustomReviewTagExtension";
// import HeaderExtension from "./TiptapExtensions/CustomHeaderExtension";
// import {
//   CustomTableNode,
//   tableRow,
//   tableCell,
// } from "./TiptapExtensions/CustomTableExtension";
import "./TiptapEditor.css";
//import PageExtension from "./TiptapExtensions/CustomPageExtension";
// import PageViewExtension from "./TiptapExtensions/CustomPageViewExtension";
// import PageViewReact from "./TiptapExtensions/CustomPageReactExtension";
// import HeaderReactExtension from "./TiptapExtensions/CustomHeadeReactExtension";
// import FooterReactExtension from "./TiptapExtensions/CustomFooterReactExtension";
// import PageContentExtension from "./TiptapExtensions/CustomPageContentExtension";

import PageExtension from "./TiptapExtensions/CustomPage";
import PageContentExtension from "./TiptapExtensions/CustomPageContent";
import HeaderExtension from "./TiptapExtensions/CustomHeader";
import FooterExtension from "./TiptapExtensions/CustomFooter";
import CustomImgExtension from "./TiptapExtensions/CustomImgExtension";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import Image from "@tiptap/extension-image";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";

//import Document from '@tiptap/starter-kit';

// const Document = Node.create({
//   name: "doc",
//   topNode: true,
//   content: 'block+',
// });

// const Paragraph = Node.create({
//   name: "paragraph",
//   group: "block",
//   content: "inline*",
//   parseHTML() {
//       return [{ tag: 'p' }];
//   },
//   renderHTML({ HTMLAttributes }) {
//       return ['p', HTMLAttributes, 0];
//   },
// });

// const Text = Node.create({
//   name: "text",
//   group: "inline",
// });

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
  Document,
  ExtendExtension,
  Paragraph,
  Text,
  Bold,
  Italic,
  Strike,
  Code,
  History,
  NonEditableExtension,
  // PageViewReact,
  // HeaderReactExtension,
  CustomInputReact,
  CustomTable.configure({
    resizable: true,
  }),
  CustomTableRow,
  CustomTableCell,
  CustomTableHeader,
  // PageContentExtension,
  // FooterReactExtension,
  Image,
  Heading,
  HorizontalRule,
  OrderedList,
  ListItem,
  BulletList,
  CustomImgExtension,
  HeaderExtension,
  FooterExtension,
  PageContentExtension,
  PageExtension,
  //NonEditableExtension,
  //StarterKit,
  /*
 
  StarterKit,
  CustomTable.configure({
    resizable: true,
  }),
  CustomTableRow,
  CustomTableCell,
  CustomInputNode,
  CustomTableHeader,
  
  CustomInputReact,
  
  ExtendExtension,
  ProcessFlowExtension,
  ReviewTagViewExtension,
  PageExtension,
  PageViewReact,
  HeaderReactExtension,*/
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
