import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";

const key = new PluginKey("nonEditable");

function checkIsWithinPage(transaction, state, type) {
  for (let i = 0; i < transaction.steps.length; i++) {
    const step = transaction.steps[i] as any;
    // Get the position and the node before the step
    //let pos = step.from;
    let pos = step.to;
    //let resolvedPos = state.doc.resolve(pos);
    let pNode = state.doc.resolve(pos).node();
    console.log(pNode);
    while (pNode) {
      if (
        pNode.type.name === type
        //  &&
        // (pNode.attrs.class === "non-extend" || pNode.attrs.class === "extend")
      ) {
        break;
      }
      try {
        pos = state.doc.resolve(pos).before();
      } catch {
        //no nodes before
        pNode = null;
        return;
      }
    }
  }

  return;
}

const nonEditablePlugin = new Plugin({
  key,
  props: {
    handleDOMEvents: {
      keypress: (view, event) => {
        const { state } = view;
        const { $from } = state.selection;
        const parentNode = $from.parent;
        const node = $from.node();
        if (parentNode && parentNode.attrs.class === "non-extend") {
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
  },
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
    // if (!transaction.docChanged) {
    //   return true;
    // }
    console.log(transaction);

    // function findParentNode(pos, state) {
    function findParentNode(pos, state) {
      return state.doc.nodeAt(pos);
    }

    // const parentPage = checkIsWithinPage(transaction, state, "pageviewreact");
    // console.log("parent is not a page");
    // if (!parentPage) return false;

    // const parentExtend = checkIsWithinPage(transaction, state, "extend");
    // if (parentExtend) {
    //   // if (parentExtend.attrs.version === 0) {
    //   return true;
    //   // }
    // }
    // return false;

    // Loop through the steps in the transaction
    // for (let i = 0; i < transaction.steps.length; i++) {
    if (transaction.steps?.length === 0) {
      return true;
    }
    const step = transaction.steps[0] as any;
    // Get the position and the node before the step
    //let pos = step.from;
    let pos = step.to;
    //let resolvedPos = state.doc.resolve(pos);
    let pNode = state.doc.resolve(pos).node();
    console.log("pnode", pNode);
    while (pNode) {
      if (
        pNode.type.name === "extend"
        //  &&
        // (pNode.attrs.class === "non-extend" || pNode.attrs.class === "extend")
      ) {
        break;
      }
      try {
        pos = state.doc.resolve(pos).before();
        pNode = findParentNode(pos, state);
        console.log("pnode-parent", pNode);
      } catch {
        //no nodes before
        pNode = null;
        break;
      }
    }
    // }
    return true;
    // if (pNode && pNode.attrs.version === 0) return true;
    // else return false;
  },
});

const NonEditableExtension = Extension.create({
  name: "nonEditable",

  addProseMirrorPlugins() {
    return [nonEditablePlugin];
  },
});
export default NonEditableExtension;
