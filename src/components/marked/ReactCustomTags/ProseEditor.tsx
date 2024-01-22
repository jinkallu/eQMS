import { useEffect, useState } from "react";
import { useExtnStore } from "../../../zustand/store";
import { EditorState, Transaction } from "prosemirror-state";
import { ProseMirror } from "@nytimes/react-prosemirror";
import { schema } from "prosemirror-schema-basic"
import { exampleSetup } from 'prosemirror-example-setup';
import { toggleMark } from 'prosemirror-commands'; // Import toggleMark here
import { EditorView } from "prosemirror-view"; // Import EditorView from prosemirror-view
import { MenuItem, Dropdown, menuBar } from 'prosemirror-menu';
import { Schema, DOMParser as PDOMParser, NodeSpec } from "prosemirror-model"
import { addListNodes } from "prosemirror-schema-list"
import 'prosemirror-view/style/prosemirror.css';
import "prosemirror-menu/style/menu.css";
import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'

import { tableNodes,  } from "prosemirror-tables";
import { Plugin } from "prosemirror-state";
import InputView from './InputView'; // replace with your actual import
import ReactDOM from 'react-dom';




export default function ProseEditor({ element, order, id }) {
    const [mount, setMount] = useState<HTMLElement | null>(null);


    const testSchema = new Schema({
        nodes: {
            doc: { content: "block+" },
            paragraph: {
                content: "inline*",
                group: "block",
                parseDOM: [{ tag: "p" }],
                toDOM() { return ["p", 0]; }
            },
            text: {
                group: "inline"
            },
            input: {
                inline: true,
                group: "inline",
                attrs: {
                    type: { default: "text" },
                    value: { default: "" },
                    id: { default: "" } // Add 'id' attribute here
                },
                parseDOM: [{
                    tag: "input",
                    getAttrs: (node: HTMLElement) => ({
                        type: node.getAttribute("type"),
                        value: node.getAttribute("value"),
                        id: node.getAttribute("id") // Get 'id' attribute from DOM
                    })
                }],
                toDOM: (node) => {
                    const dom = document.createElement("input");
                    dom.setAttribute("id", node.attrs.id);
                    dom.setAttribute("value", node.attrs.value);
                    return dom;
                }
            }
        }
     });



    const inputMenuItem = new MenuItem({
        title: 'Insert InputField',
        label: 'Input',
        run: insertInputField,
        //icon: /* Your icon or label for the menu item */,
    });

    // Define the command
    function insertInputField(state, dispatch) {
        // Create a new 'input' node
        const inputNode = testSchema.nodes.input.create();

        // Insert the 'input' node at the current selection
        const tr = state.tr.replaceSelectionWith(inputNode);

        // Apply the transaction
        if (dispatch) dispatch(tr);
    }


    const menuItems = [
        inputMenuItem,

        new MenuItem({
            title: 'Bold',
            label: 'Bold',
            run: (state, dispatch) => {
                // Implement command to toggle bold formatting
                toggleMark(schema.marks.strong)(state, dispatch);

            }
        }),
        new MenuItem({
            title: 'Italic',
            label: 'Italic',
            run: (state, dispatch) => {
                // Implement command to toggle italic formatting
                toggleMark(schema.marks.em)(state, dispatch);

            }
        })
    ];
    // Create a dropdown menu
    const dropdown = new Dropdown(menuItems, { label: 'Format' });

    const menu = menuBar({ floating: true, content: [[dropdown]] });

    const [editorState, setEditorState] = useState(

        EditorState.create({

            schema: testSchema,
            //doc: defaultContent,
            plugins: [
                menu,
                keymap(baseKeymap),
             
            ], 
        })
    );


    const { templateState, setTemplateState } = useExtnStore((state) => state);
    function handleChangeFun(e) {
        setTemplateState(id, e.target.value);
    }


    let component;

    switch (order) {
        case "first":
            component = (
                <h1>DocX</h1>
            );

            break;
        case "middle":

            component = (
                <div>
                    Hi
                </div>
            );
            break;
        case "last":
            component = (
                <ProseMirror
                    mount={mount}
                    defaultState={editorState}
                //dispatchTransaction={dispatchTransaction}
                >
                    <div ref={setMount} />

                </ProseMirror>
            );

            break;
        default:
            component = <span>"Error";</span>;
            break;
    }
    return component;
}
