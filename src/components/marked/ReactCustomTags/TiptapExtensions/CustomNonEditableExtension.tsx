import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "prosemirror-state";
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
  appendTransaction: (transactions, oldState, newState) => {
    //let headerChanged = transactions.some(tr => tr.docChanged);
    //let headerChanged = transactions.some(tr => tr.docChanged && tr.steps.some(step => step.slice.content.some(node => node.type.name === 'header')))
    let docChanged = transactions.some(tr => tr.docChanged);
    let oldNode = null;
    if (docChanged) {
      transactions.forEach((transaction) => {
        transaction.steps.forEach((step: any) => {
          console.log(step);
          let pos = step.to;
          let oldStatePos = oldState.doc.resolve(pos);
          oldNode = oldStatePos.node();
          while (oldNode) {
            if (oldNode.type.name === "header") {
              console.log(oldNode);
              break;
            }
            else if (oldNode.type.name === "doc") {
              break;
            }

            try {
              oldStatePos = oldState.doc.resolve(pos);
              pos = oldStatePos.before(); // node parent
              oldNode = oldState.doc.nodeAt(pos);
            } catch {
              //no nodes before
              oldNode = null;
              break;
            }
          }
          if (oldNode && oldNode.type.name === "header") {
            return;
          }
        });
        if (oldNode && oldNode.type.name === "header") {
          return;
        }
      });
    }

    console.log(oldNode);

    if (oldNode && oldNode.type.name === "header") {
      // Get the content of the first header in the new state
      let headerContent
      newState.doc.descendants(node => {
        if (node.type.name === 'header' && node.attrs.id === oldNode.attrs.id) {
          headerContent = node.content

          return false
        }
      })

      console.log(headerContent);

      // If no header was found, do nothing
      if (!headerContent) return null

      let { from, to } = newState.selection;

      // Create a new transaction to update all headers
      let tr = newState.tr
      let counter = 0;
      newState.doc.descendants((node, pos) => {
        if (node.type.name === 'header') {
          if (node.attrs.id !== oldNode.attrs.id) {
            
            let newHeader = node.type.create(node.attrs, headerContent)
            // Replace the existing header node with the new one
            tr.replaceWith(pos + counter, pos + counter + node.nodeSize, newHeader)

            counter += newHeader.nodeSize - node.nodeSize;

            // if(pos >= from){
            //   from += counter;
            //   to += counter;
            // }
          }
        }
      })

      tr.setSelection(TextSelection.create(tr.doc, from, to));

      return tr
    }
    // Check if any of the transactions changed a header node
    // const headerChanged = transactions.some(tr => tr.docChanged && tr.steps.some(step => {
    //   // Use reduce instead of forEach to avoid mutability issues
    //   return step.slice.content.reduce((found, node) => found || node.type.name === 'header', false);
    // }));

    // if (headerChanged) {
    //   console.log(transactions, oldState, newState);
    // }
    return null;
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
    //console.log(transaction);

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
    //console.log("pnode", pNode);
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
        //console.log("pnode-parent", pNode);
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
