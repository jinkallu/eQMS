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

import ExtendExtension from "./TiptapExtensions/CustomExtendExtension";
import NonEditableExtension from "./TiptapExtensions/CustomNonEditableExtension";
import CustomProcessFlow from "./TiptapExtensions/CustomProcessflowExtension";

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

import "./TiptapEditor.css";

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
  CustomProcessFlow,
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
