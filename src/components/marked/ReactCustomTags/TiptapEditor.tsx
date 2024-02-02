import {
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useExtnStore } from "../../../zustand/store";
import { customTableNode } from "./CustomTableNode";
import CustomInputNode from "./CustomInputNode";
import { TiptapMenuBar } from "./TiptapMenubar";
import CustomInputReact from "./CustomInputReactExtension";

// define your extension array
const extensions = [
  StarterKit,
  CustomInputNode,
  customTableNode.table,
  customTableNode.table_row,
  customTableNode.table_cell,
  CustomInputReact,
];

// const content = "<p>Hello World!</p>";

const TiptapEditor = ({ content }) => {
  const { templateState } = useExtnStore((state) => state);

  return (
    <EditorProvider
      extensions={extensions}
      // content={templateState[id] || " "}
      content={content || " "}
      slotBefore={<TiptapMenuBar />}
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
