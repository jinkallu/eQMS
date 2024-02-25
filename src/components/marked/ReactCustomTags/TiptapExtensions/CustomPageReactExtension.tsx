import {
  NodeViewContent,
  NodeViewWrapper,
  useCurrentEditor,
} from "@tiptap/react";

import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import TiptapInputDialog from "../TiptapInputDialog";
import { useIsOverflow } from "../../../../CHooks/useIsOverflow";
import { EditorState } from "@tiptap/pm/state";
import { v4 as uuidv4 } from "uuid";
const StyleA4 = {
  background: "white",
  display: "block",
  margin: "0 auto",
  marginBottom: "0.5cm",
  boxShadow: "0 0 0.5cm rgba(0,0,0,0.5)",
  width: "21cm",
  height: "5.7cm",
  overflow: "auto",
};
const Component = (props) => {
  console.log(props);
  const ref = React.useRef(null);
  const isOverflow = useIsOverflow(ref);

  useEffect(() => {
    if (isOverflow) {
      addPageJSON(props.node.attrs?.id);
    }
  }, [isOverflow]);

  //   function deleteNode() {
  //     const start = props.getPos();
  //     props.editor
  //       .chain()
  //       .deleteRange({ from: start, to: start + props.node.nodeSize })
  //       .run();
  //   }

  function addPageJSON(id) {
    const jsonData = props.editor.getJSON();
    const pages = jsonData.content[0].content;
    const indexToInsert = pages?.findIndex((page) => page.attrs.id === id);
    const header = {
      ...pages[0].content[0],
      attrs: { ...pages[0].content[0], id: uuidv4() },
    };

    if (indexToInsert === pages?.length - 1) {
      // Need to insert a new page

      const lastContent =
        pages[indexToInsert].content[pages[indexToInsert].content?.length - 1];
      const arrLength = pages[indexToInsert].content?.length;
      if (arrLength - 1 > 0)
        pages[indexToInsert].content?.splice(arrLength - 1, 1);

      // remove the last content from current page and insert it to new page

      pages.push({
        attrs: { ...pages[0].attrs, id: uuidv4() },
        type: pages[0].type,
        content: [header, lastContent],
      });
      jsonData.content[0].content = [...pages];
      queueMicrotask(() => props.editor.commands.setContent(jsonData));
    } else {
      // last content of current page should be pushed to next page
      const lastContent =
        pages[indexToInsert].content[pages[indexToInsert].content?.length - 1];
      const arrLength = pages[indexToInsert].content?.length;
      if (arrLength - 1 > 0)
        pages[indexToInsert].content?.splice(arrLength - 1, 1);
      if (pages[indexToInsert + 1].content) {
        pages[indexToInsert + 1].content.splice(1, 0, lastContent);
      } else {
        pages[indexToInsert + 1].content = [header, lastContent];
      }
      jsonData.content[0].content = [...pages];
      queueMicrotask(() => props.editor.commands.setContent(jsonData));
    }
  }

  //   function addPage() {
  //     const endPos = props.getPos() + props.node.nodeSize;

  //     // I focus the start of the editor because
  //     // when the cursor is at the end of the node below which
  //     // we want to add a block, it doesn't focus the next block
  //     props.editor.commands.focus("start");

  //     props.editor
  //       .chain()
  //       .insertContentAt(endPos, {
  //         type: "pageviewreact",
  //         attrs: { id: uuidv4() },
  //       })
  //       .focus(endPos)
  //       .run();
  //      }

  return (
    <NodeViewWrapper style={StyleA4} ref={ref}>
      {/* <button onClick={addPage}>Add</button>
      <button onClick={deleteNode}>Remove</button>
      <button onClick={addPageJSON}>Add Page JSON</button> */}
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export default Node.create({
  name: "pageviewreact",

  //group: "block",

  content: "block*",

  addAttributes() {
    return {
      version: {
        default: -1,
      },
      id: { default: uuidv4() },
      class: {
        default: "pageviewreact",
      },
      contenteditable: {
        default: true,
      },
      style: {
        default:
          "background:white;display: block;margin: 0 auto; margin-bottom: 0.5cm;box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);width: 21cm; height: 300px",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.pageviewreact",
      },
    ];
  },

  // addKeyboardShortcuts() {
  //   return {
  //     "Mod-Enter": () => {
  //       return this.editor
  //         .chain()
  //         .insertContentAt(this.editor.state.selection.head, {
  //           type: this.type.name,
  //         })
  //         .focus()
  //         .run();
  //     },
  //   };
  // },

  renderHTML({ node, HTMLAttributes }) {
    let attrs = mergeAttributes(HTMLAttributes);
    if (node.attrs.class === "pageviewreact") {
      attrs = {
        ...attrs,
        style:
          "background: white;display: block;margin: 0 auto; margin-bottom: 0.5cm;box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);width: 21cm; height: 29.7cm",
      };
    }
    // } else if (node.attrs.class === "non-extend") {
    //   attrs = {
    //     ...attrs,
    //     style: "border: 1px solid red; margin-bottom: 3px",
    //   };
    // }
    return ["div", attrs, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
