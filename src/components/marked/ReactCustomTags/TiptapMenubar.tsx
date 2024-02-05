import { useCurrentEditor } from "@tiptap/react";
import TiptapInputDialog from "./TiptapInputDialog";
import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
export function TiptapMenuBar() {
  const { editor } = useCurrentEditor();
  const [inputOpen, setInputOpen] = useState(false);

  if (!editor) {
    return null;
  }
  function handleCreateInputClick() {
    setInputOpen(true);
  }

  function handleIncreaseVersion() {
    const htmlString = editor.getHTML();
    const html = new DOMParser().parseFromString(htmlString, "text/html");
    const extendNodes = html.querySelectorAll("div.extend");
    Array.from(extendNodes)?.map((node) => {
      const version = node.getAttribute("version");
      if (version) {
        node.setAttribute("version", (+version + 1).toString());
      }
    });
    console.log(html);

    // const nodes = editor.$nodes("extend");
    // console.log(nodes);
    // nodes?.map((node) => {
    //   node.setAttribute({ version: +node.attributes.version + 1 });
    // });
  }

  // function handleExtendClick(){
  //   editor
  //     .chain()
  //     .focus()
  //     .insertContent({ type: "extend", attrs: { class: "extend" } })
  //     .run();
  // }
  function handleExtendClick() {
    const textToAdd = "Your text goes here"; // Specify the text you want to add

    editor
      .chain()
      .focus()
      .insertContent({
        type: "extend",
        attrs: { class: "extend" },
        content: [
          { type: "paragraph", content: [{ type: "text", text: textToAdd }] },
        ],
      })
      // .selectParentNode() // Select the recently inserted "extend" element
      // .insertContent({
      //   type: "paragraph",
      //   attrs: { class: "paragraph" },
      //   content: [{ type: "text", text: textToAdd }],
      // })
      .run();
  }

  function addInput(id) {
    console.log("id", id);
    editor
      .chain()
      .focus()
      .insertContent({
        type: "rInput",
        attrs: { id },
      })
      .run();

    setInputOpen(false);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Toolbar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <TiptapInputDialog
          open={inputOpen}
          setOpen={setInputOpen}
          addInput={addInput}
        ></TiptapInputDialog>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          paragraph
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          h1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          h2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          h3
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          }
        >
          h4
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          }
        >
          h5
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          }
        >
          h6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          blockquote
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          redo
        </button>

        <button
          onClick={handleCreateInputClick}
          className={
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "is-active"
              : ""
          }
        >
          Input
        </button>
        <button
          onClick={handleExtendClick}
          className={
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "is-active"
              : ""
          }
        >
          Extend
        </button>
        <button onClick={handleIncreaseVersion}>Increase Version</button>
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          insertTable
        </button>

        {/* <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent({
              type: "rTable",
              //   content: [
              //     {
              //       type: "text",
              //       text: "New block added",
              //     },
              //   ],
            })
            .run()
        }
        className={
          editor.isActive("textStyle", { color: "#958DF1" }) ? "is-active" : ""
        }
      >
        Table
      </button> */}

        {/* <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent({ type: "custom_input", attrs: { id: "testInput" } })
            .run()
        }
        className={
          editor.isActive("textStyle", { color: "#958DF1" }) ? "is-active" : ""
        }
      >
        Table
      </button> */}

        <button
          onClick={() => console.log(editor.getHTML())}
          className={
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "is-active"
              : ""
          }
        >
          Console HTML
        </button>
        <button
          onClick={() => console.log(editor.getJSON())}
          className={
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "is-active"
              : ""
          }
        >
          Console JSON
        </button>

        <button
          onClick={() => console.log(editor.getText())}
          className={
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "is-active"
              : ""
          }
        >
          Console TEXT
        </button>
      </Box>
    </Box>
  );
}
