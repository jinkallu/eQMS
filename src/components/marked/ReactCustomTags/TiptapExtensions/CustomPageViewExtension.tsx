import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";

const key = new PluginKey("pageView");

const pageViewPlugin = new Plugin({
  key,
  //   props: {
  //     handleDOMEvents: {
  //       keypress: (view, event) => {
  //         console.log("Keypress", event);
  //         const { state } = view;
  //         const { $from } = state.selection;
  //         const parentNode = $from.parent;
  //         const node = $from.node();
  //         if (parentNode && parentNode.attrs.class === "non-extend") {
  //           event.preventDefault();
  //           return true;
  //         }
  //         return false;
  //       },
  //     },
  //   },
  /*
    appendTransaction: (transactions, oldState, newState) => {
  
      
      console.log("Transaction", transactions, oldState, newState);
      // If there are no transactions, do nothing
      if (!transactions.length) return null;
  
      // Loop through the transactions
      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
  
        // If the transaction changes the document
        if (transaction.docChanged) {
          let newTransaction = newState.tr;
          console.log(newTransaction);
          newTransaction.setMeta('appendedTransaction', null); // Clear the 'appendedTransaction' meta data
          console.log(newTransaction);
          // Loop through the steps in the transaction
          for (let j = 0; j < transaction.steps.length; j++) {
            const step = transaction.steps[j];
            // Get the position and the node before the step
            const pos = step.from;
            const node = oldState.doc.nodeAt(pos);
            const resolvedPos = oldState.doc.resolve(pos);
            const parentNode = resolvedPos.parent;
            const grandParentNode = resolvedPos.node(resolvedPos.depth - 1);
            console.log(node, parentNode, grandParentNode)
  
            // If the node has the 'non-extend' class, cancel the transaction
            if (!(grandParentNode && grandParentNode.attrs.class === 'non-extend')) {
              console.log("Non editable ")
              newTransaction.step(step);
            }
            // if (grandParentNode && grandParentNode.attrs.class === 'non-extend') {
            //   console.log("Non editable ")
            //   return oldState;
            // }
          }
          //if (newTransaction.steps.length) {
            console.log(newTransaction);
            return newTransaction;
          //}
        }
      }
  
      
  
      // If no 'non-extend' nodes are being changed, allow the transactions
      return null;
    },*/
  filterTransaction: (transaction, state) => {
    function findParentNode(pos, state) {
      return state.doc.nodeAt(pos);
    }
    // Loop through the steps in the transaction
    for (let i = 0; i < transaction.steps.length; i++) {
      const step = transaction.steps[i] as any;
      // Get the position and the node before the step
      //let pos = step.from;
      let pos = step.to;
      //let resolvedPos = state.doc.resolve(pos);
      let pNode = state.doc.resolve(pos).node();
      while (pNode) {
        if (pNode.type.name === "pageview") {
          break;
        }
        try {
          pos = state.doc.resolve(pos).before();
          pNode = state.doc.resolve(pos).node();
        } catch {
          pNode = null;
          break;
        }
      }
      console.log(pNode);
    }
    return true;
  },
});

const PageViewExtension = Extension.create({
  name: "pageView",

  addProseMirrorPlugins() {
    return [pageViewPlugin];
  },
});
export default PageViewExtension;
