import { EditorProvider, FloatingMenu, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useExtnStore } from "../../../zustand/store";

// define your extension array
const extensions = [StarterKit];

// const content = "<p>Hello World!</p>";

const TiptapEditor = ({ id }) => {
  const { templateState } = useExtnStore((state) => state);
  return (
    <EditorProvider extensions={extensions} content={templateState[id] || " "}>
      <FloatingMenu>This is the floating menu</FloatingMenu>
      <BubbleMenu>This is the bubble menu</BubbleMenu>
    </EditorProvider>
  );
};

export default TiptapEditor;
