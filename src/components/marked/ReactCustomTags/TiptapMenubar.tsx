import { useCurrentEditor } from "@tiptap/react";
import TiptapInputDialog from "./TiptapInputDialog";
import TiptapImageOpenDialog from "./TiptapImageOpenDialog";
import { useEffect, useState } from "react";
import { Box, Grid, IconButton, Paper, Toolbar, Tooltip } from "@mui/material";
import { useExtnStore } from "../../../zustand/store";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CodeIcon from "@mui/icons-material/Code";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { v4 as uuidv4 } from "uuid";
import TiptapDocxOpenDialog from "./TiptapDocxOpenDialog";
export function TiptapMenuBar() {
  const [insertStarted, setInsertStarted] = useState(false);
  const { editor } = useCurrentEditor();
  const [inputOpen, setInputOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [docxOpen, setDocxOpen] = useState(false);

  const { setEditorState } = useExtnStore((state) => state);

  if (!editor) {
    return null;
  }

  editor.on("update", ({ editor, transaction }) => {
    const htmlString = editor.getHTML();

    setEditorState(htmlString);
  });

  function handleCreateInputClick() {
    setInputOpen(true);
  }

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

      .run();
  }

  const mutationCallbackDom = (mutationsList) => {
    if (insertStarted) {
      return;
    }
    for (const mutation of mutationsList) {
      // sync header or footer changes

      // mutation.target.parentNode.removeChild(mutation.target);

      // Check width after each update
      const pages = document.getElementsByClassName("page");
      for (let i = 0; i < pages.length; ++i) {
        if (pages[i].scrollHeight > pages[i].clientHeight) {
          const lastChild = pages[i].childNodes[1].lastChild;
          pages[i].childNodes[1].removeChild(lastChild);

          if (i === pages.length - 1) {
            // add new page
            const newPage = pages[i].cloneNode(true);

            newPage.childNodes[1].textContent = "";
            newPage.childNodes[1].appendChild(lastChild);

            pages[i].parentNode.appendChild(newPage);
          } else {
            //  push to next page as first child

            pages[i + 1].children[1].prepend(lastChild);

            // pages[i + 1].childNodes[1].insertBefore(
            //   lastChild,
            //   pages[i + 1].childNodes[1].firstChild
            // );
          }
          break;
        }
      }
    }
  };

  const observer = new MutationObserver(mutationCallbackDom);

  // Observe the editor's DOM
  observer.observe(editor.view.dom, {
    attributes: true,
    childList: true,
    subtree: true,
  });
  //}, [])

  function handleHeaderClick() {
    editor
      .chain()
      .focus()
      .insertContent(
        `
    
      <table style="border-collapse: collapse; border: 1px solid black;">
      <tbody>
          <tr>
            <td style="border: 1px solid black;">Document Version: </td>
            <td style="border: 1px solid black;"><strong>SOP-100</strong></td>
            <td style="border: 1px solid black;">Data 9</td>
          </tr>
          <tr>
            <td style="border: 1px solid black;">Template Version</td>
            <td style="border: 1px solid black;"><h1>Risk Management</h1></td>
            <td style="border: 1px solid black;">Data 9</td>
          </tr>
          </tbody>
      </table>
  
  `
      )
      .run();
  }

  function handleImageClick() {
    setImageOpen(true);
  }

  function insertImage(filePath) {
    editor
      .chain()
      .focus()
      // .insertContent(`<custom-image path=${filePath}></custom-image>`)
      .insertContent({ type: "CustomImage", attrs: { path: filePath } })
      .run();

    setImageOpen(false);
  }

  function handleDocxClick() {
    setDocxOpen(true);
  }

  function insertDocx(htmlDoc) {
    setInsertStarted(true);

    queueMicrotask(() => editor.commands.insertContent(htmlDoc));
    queueMicrotask(() => setInsertStarted(false));
  }

  function addInput(id) {
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

  useEffect(() => {
    setEditorState(editor.getHTML());
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Toolbar></Toolbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "70px",
          flexDirection: "column",
          width: "100%",
          height: "50px",
          position: "fixed",
          backgroundColor: "#F5F5F5",
          opacity: 1,
          zIndex: 50,
        }}
      >
        <Grid container>
          <Grid item sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <TiptapInputDialog
                open={inputOpen}
                setOpen={setInputOpen}
                addInput={addInput}
              ></TiptapInputDialog>

              <TiptapImageOpenDialog
                imageOpen={imageOpen}
                setImageOpen={setImageOpen}
                insertImage={insertImage}
              ></TiptapImageOpenDialog>
              <TiptapDocxOpenDialog
                docxOpen={docxOpen}
                setDocxOpen={setDocxOpen}
                insertDocx={insertDocx}
              ></TiptapDocxOpenDialog>

              <Tooltip title="Bold">
                <IconButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "is-active" : ""}
                >
                  <FormatBoldIcon></FormatBoldIcon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Italic">
                <IconButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "is-active" : ""}
                >
                  <FormatItalicIcon></FormatItalicIcon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Strike through">
                <IconButton
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  disabled={!editor.can().chain().focus().toggleStrike().run()}
                  className={editor.isActive("strike") ? "is-active" : ""}
                >
                  <FormatStrikethroughIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Insert code">
                <IconButton
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  disabled={!editor.can().chain().focus().toggleCode().run()}
                  className={editor.isActive("code") ? "is-active" : ""}
                >
                  <CodeIcon></CodeIcon>
                </IconButton>
              </Tooltip>

              {/* <button
                onClick={() => editor.chain().focus().unsetAllMarks().run()}
              >
                clear marks
              </button>
              <button onClick={() => editor.chain().focus().clearNodes().run()}>
                clear nodes
              </button> */}
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
            </Box>
          </Grid>
          <Grid item sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Tooltip title="Bullet list">
                <IconButton
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={editor.isActive("bulletList") ? "is-active" : ""}
                >
                  <FormatListBulletedIcon></FormatListBulletedIcon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Ordered List">
                <IconButton
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className={editor.isActive("orderedList") ? "is-active" : ""}
                >
                  <FormatListNumberedIcon></FormatListNumberedIcon>
                </IconButton>
              </Tooltip>

              {/* <button
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
              </button> */}
              <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                horizontal rule
              </button>
              {/* <button
                onClick={() => editor.chain().focus().setHardBreak().run()}
              >
                hard break
              </button> */}
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
              {/* <button onClick={handleIncreaseVersion}>Increase Version</button> */}
              <button
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
              >
                Table
              </button>
              <button
                onClick={handleHeaderClick}
                className={
                  editor.isActive("textStyle", { color: "#958DF1" })
                    ? "is-active"
                    : ""
                }
              >
                Header
              </button>
              <button
                onClick={handleImageClick}
                className={
                  editor.isActive("textStyle", { color: "#958DF1" })
                    ? "is-active"
                    : ""
                }
              >
                Image
              </button>

              <button
                onClick={handleDocxClick}
                className={
                  editor.isActive("textStyle", { color: "#958DF1" })
                    ? "is-active"
                    : ""
                }
              >
                Docx
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

              {/* <button
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
          </button> */}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
