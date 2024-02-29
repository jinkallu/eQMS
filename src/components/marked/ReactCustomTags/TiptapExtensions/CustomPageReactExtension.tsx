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
  display: "flex",
  margin: "0 auto",
  boxShadow: "0 0 0.5cm rgba(0,0,0,0.5)",
  width: "21cm",
  height: "10.7cm",
  overflow: "hidden",
  overflowX: "hidden",
};

const styleContent = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  flexGrow: 1,
};
const Component = (props) => {
  const ref = React.useRef(null);
  const { isOverflow, isOverflowHoriz } = useIsOverflow(ref);
  const { editor } = useCurrentEditor();
  // useEffect(() => {
  //   console.log(isOverflow);
  //   if (isOverflow) {
  //     addPageJSON(props.node.attrs?.id);
  //   }
  //   if (isOverflowHoriz) {
  //     handleOverflowHoriz();
  //   }
  // }, [isOverflow, isOverflowHoriz]);

  function handleOverflowHoriz() {
    queueMicrotask(() =>
      editor
        .chain()
        .focus()
        .command(({ tr }) => {
          // manipulate the transaction
          const from = tr.selection.from - 1;

          tr.insertText("\n", from);

          return true;
        })
        .run()
    );
  }

  function setFocus(id) {
    const nodes = editor.$nodes("page", { id });
    console.log(editor);
  }

  function addPageJSON(id) {
    // get the json of the editor
    const jsonData = props.editor.getJSON();
    // get the pages from json
    const pages = jsonData.content[0].content;

    const indexToInsert = pages?.findIndex((page) => page.attrs.id === id);
    console.log(indexToInsert);

    const header = {
      ...pages[0].content[0],
      attrs: { ...pages[0].content[0], id: uuidv4() },
    };

    const footer = {
      ...pages[0].content[2],
      attrs: { ...pages[0].content[2], id: uuidv4() },
    };

    const newPageContent = {
      ...pages[0].content[1],
      attrs: { ...pages[0].content[1], id: uuidv4() },
    };

    const pageContent = pages[indexToInsert].content[1].content;

    const lastContent = pageContent[pageContent?.length - 1];
    const arrLength = pageContent?.length;

    if (indexToInsert === pages?.length - 1) {
      // Need to insert a new page

      // pages[indexToInsert].content[1].content[
      //   pages[indexToInsert].content[1].content?.length - 1
      // ];
      if (arrLength - 1 > 0)
        pages[indexToInsert].content[1].content?.splice(arrLength - 1, 1);

      // remove the last content from current page and insert it to new page
      newPageContent.content = [lastContent];
      const newId = uuidv4();
      pages.push({
        attrs: { ...pages[0].attrs, id: newId },
        type: pages[0].type,
        content: [header, newPageContent, footer],
      });
      jsonData.content[0].content = [...pages];
      queueMicrotask(() => {
        props.editor.commands.setContent(jsonData);
        setFocus(newId);
      });
    } else {
      // last content of current page should be pushed to next page
      // const lastContent =
      //   pages[indexToInsert].content[pages[indexToInsert].content?.length - 1];
      // const arrLength = pages[indexToInsert].content?.length;
      if (arrLength - 1 > 0)
        pages[indexToInsert].content[1].content?.splice(arrLength - 1, 1);
      if (pages[indexToInsert + 1].content[1]?.content) {
        pages[indexToInsert + 1].content[1].content.splice(0, 0, lastContent);
      } else {
        pages[indexToInsert + 1].content[1].content = [
          header,
          lastContent,
          footer,
        ];
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
  //         type: "page",
  //         attrs: { id: uuidv4() },
  //       })
  //       .focus(endPos)
  //       .run();
  //      }

  // Function to check width after each update
  const checkWidthAfterUpdate = () => {
    const nodes = editor.view.dom.querySelectorAll('div.content'); // Change '.your-node-class' to your node's class or selector
    
    nodes.forEach((node: HTMLElement) => {
      
      if(node.scrollHeight > node.clientHeight){
        console.log("adding page")
        addPageJSON(props.node.attrs?.id);
      }
      if(node.scrollWidth > node.clientWidth){
        console.log("handle overflow hori")
        handleOverflowHoriz();
      }
    })
  };

  // Callback function for MutationObserver
  const mutationCallback = (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        // Check width after each update
        checkWidthAfterUpdate();
      }
    }
  };

  useEffect(() => {
    console.log('Effect is being called');

    // Create a MutationObserver to observe changes in the DOM
    const observer = new MutationObserver(mutationCallback);

    // Observe the editor's DOM
    observer.observe(editor.view.dom, { attributes: true, childList: true, subtree: true });
  }, []);

  return (
    <NodeViewWrapper style={StyleA4} ref={ref}>
      {/* <button onClick={addPage}>Add</button> 
      <button onClick={deleteNode}>Remove</button>
      <button onClick={addPageJSON}>Add Page JSON</button> */}
      <NodeViewContent class="content" id="testContent" />
    </NodeViewWrapper>
  );
};

export default Node.create({
  name: "page",

  content: "header pagecontent footer",

  addAttributes() {
    return {
      version: {
        default: -1,
      },
      id: { default: uuidv4() },
      class: {
        default: "page",
      },
      contenteditable: {
        default: true,
      },
      style: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.page",
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
    // if (node.attrs.class === "page") {
    //   attrs = {
    //     ...attrs,
    //   };
    // }
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
