import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Extension } from "@tiptap/core";

const key = new PluginKey("nonEditable");

const nonEditablePlugin = new Plugin({
  key,
  props: {
    handleDOMEvents: {
      keypress: (view, event) => {
        console.log("Keypress", event);
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
    //const editor = useEditor();

    // function findParentNode(pos, state) {
    //   // Resolve the position
    //   const resolvedPos = state.doc.resolve(pos);

    //   // Start from the current node and go up the tree
    //   for (let depth = resolvedPos.depth; depth > 0; depth--) {
    //     const node = resolvedPos.node(depth);
    //     if (!node) {
    //       continue;
    //     }

    //     // Check if the node is a div with the 'non-extend' class
    //     if (node.type.name === 'extend' && (node.attrs.class === 'non-extend' || node.attrs.class === 'extend')) {
    //       return node;
    //     }
    //   }

    //   // If no such node is found, return null
    //   return null;
    // }

    // function findParentNode(pos, state) {
    function findParentNode(pos, state) {
      return state.doc.nodeAt(pos);
    }
    // Loop through the steps in the transaction
    for (let i = 0; i < transaction.steps.length; i++) {
      const step = transaction.steps[i];
      // Get the position and the node before the step
      //let pos = step.from;
      let pos = step.to;
      //let resolvedPos = state.doc.resolve(pos);
      let pNode = state.doc.resolve(pos).node();
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
        } catch {
          //no nodes before
          pNode = null;
          break;
        }

        pNode = findParentNode(pos, state);
        console.log(pNode);
      }

      if (pNode && pNode.attrs.version !== 0) {
        return false;
      }
      //     console.log(pNode);
      //     const grandparentNodePos = resolvedPos.before(); // Position before the parent node
      // const grandparentNode = state.doc.nodeAt(grandparentNodePos);
      // console.log(grandparentNode)
      // const grandGrandparentNodePos = state.doc.resolve(grandparentNodePos).before(); // Position before the grandparent node
      // const grandGrandparentNode = state.doc.nodeAt(grandGrandparentNodePos);
      // console.log(grandGrandparentNode)

      // let parentNode = null;//findParentNode(pos, state);
      // while (parentNode === null && pos > 1) { // Change condition to pos > 1 to stop at the root
      //   pos--;
      //   parentNode = findParentNode(pos, state);
      //   console.log(parentNode);
      // }
      // //const resolvedPos = state.doc.resolve(pos);
      // //const grandParentNode = resolvedPos.node(resolvedPos.depth - 1);
      //let parentNode = null;

      // Use NodePosition to find the first ancestor with the schema 'extend'

      //const nodePos = new NodePos(pos, editor);
      //parentNode = nodePos.closest('extend');

      //console.log(parentNode);
      //console.log(parentNode)

      // If the grandparent node has the 'non-extend' class, cancel the transaction
      // if (parentNode && parentNode.attrs.class === 'non-extend') {
      //   return false;
      // }
    }
    // If no 'non-extend' nodes are being changed, allow the transaction
    return true;
  },
});

const NonEditableExtension = Extension.create({
  name: "nonEditable",
  addProseMirrorPlugins() {
    return [nonEditablePlugin];
  },
});
export default NonEditableExtension;
