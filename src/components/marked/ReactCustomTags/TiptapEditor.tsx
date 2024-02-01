import { EditorProvider, FloatingMenu, BubbleMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useExtnStore } from "../../../zustand/store";
import { customTableNode } from "./CustomTableNode";
import CustomInputNode from "./CustomInputNode";



// define your extension array
const extensions = [
  StarterKit,
  //CustomInputNode,
  customTableNode.table,
  customTableNode.table_row,
  customTableNode.table_cell,
];

// const content = "<p>Hello World!</p>";

const TiptapEditor = ({ id }) => {
  const { templateState } = useExtnStore((state) => state);

  
  return (
    <EditorProvider extensions={extensions} content={templateState[id] || " "}>
      <FloatingMenu>
      <InsertCustomInputButton />

      </FloatingMenu>
      <BubbleMenu>This is the bubble menu</BubbleMenu>
    </EditorProvider>
  );
};

const InsertCustomInputButton = () => {
  //const editor = useEditor();

  const insertCustomInput = () => {
    //editor.chain().focus().insertContent('<custom_input>Default text</custom_input>').run();
  };

  return <button onClick={insertCustomInput}>Insert Custom Input</button>;
};

export default TiptapEditor;
