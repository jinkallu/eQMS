import { useEffect, useState } from "react";
import { useExtnStore } from "../../../zustand/store";
import { EditorState, Transaction } from "prosemirror-state";
import { ProseMirror } from "@nytimes/react-prosemirror";
import { schema as basicSchema, nodes as basicNodes, marks } from 'prosemirror-schema-basic';
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

import { tableNodes, } from "prosemirror-tables";
import { Plugin } from "prosemirror-state";
import InputView from './InputView'; // replace with your actual import




export default function ProseEditor({ element, order, id }) {
    const [mount, setMount] = useState<HTMLElement | null>(null);

    const { templateState, setTemplateState } = useExtnStore((state) => state);
    function handleChangeFun(e) {
        setTemplateState(id, e.target.value);
    }

    // const testSchema = new Schema({
    //     nodes: {
    //         doc: { content: "block+" },
    //         paragraph: {
    //             content: "inline*",
    //             group: "block",
    //             parseDOM: [{ tag: "p" }],
    //             toDOM() { return ["p", 0]; }
    //         },
    //         text: {
    //             group: "inline"
    //         },
    //         input: {
    //             inline: true,
    //             group: "inline",
    //             attrs: {
    //                 type: { default: "text" },
    //                 value: { default: "" },
    //                 id: { default: "" } // Add 'id' attribute here
    //             },
    //             parseDOM: [{
    //                 tag: "input",
    //                 getAttrs: (node: HTMLElement) => ({
    //                     type: node.getAttribute("type"),
    //                     value: node.getAttribute("value"),
    //                     id: node.getAttribute("id") // Get 'id' attribute from DOM
    //                 })
    //             }],
    //             toDOM: (node) => {
    //                 const dom = document.createElement("input");
    //                 dom.setAttribute("id", node.attrs.id);
    //                 dom.setAttribute("value", node.attrs.value);
    //                 dom.setAttribute("disabled", node.attrs.disabled);

    //                 return dom;
    //             }
    //         }
    //     }
    // });

    const customInputNode = {
        input: {
            inline: true,
            group: 'inline',
            attrs: {
                type: { default: 'text' },
                value: { default: '' },
                id: { default: '' },
                disabled: { default: false },
            },
            parseDOM: [{
                tag: 'input',
                getAttrs: (node) => ({
                    type: node.getAttribute('type'),
                    value: node.getAttribute('value'),
                    id: node.getAttribute('id'),
                    disabled: node.hasAttribute('disabled'),
                }),
            }],
            toDOM: (node) => {
                const dom = document.createElement('input');
                dom.setAttribute('id', node.attrs.id);
                dom.setAttribute('value', node.attrs.value);

                if (node.attrs.disabled) {
                    dom.setAttribute('disabled', '');
                }

                return dom;
            },
        },
    };

    const newCustomTableNode = {
        table: {
            content: "table_row+",
            group: "block",
            attrs: {
                style: { default: null },
            },
            parseDOM: [{
                tag: "table",
                getAttrs(dom) {
                    return {
                        style: dom.getAttribute('style') || null,
                    };
                },
            }],
            toDOM(node) {
                return ["table", {
                    style: node.attrs.style || "",
                }, 0];
            },
        },
        table_row: {
            content: "table_cell+",
            group: "table_row",
            attrs: {
                style: { default: null },
            },
            parseDOM: [{ 
                tag: "tr",
                getAttrs(dom) {
                    return {
                        style: dom.getAttribute('style') || null,
                    };
                }, 
            }],
            toDOM(node) {
                return ["tr",{
                    style: node.attrs.style || "",
                }, 0];  // Add this line
            },
        },
        table_cell: {
            content: "block",
            // attrs: {
            //     // Define any additional attributes for cells
            //     class: { default: null },
            // },
            attrs: {
                style: { default: null },
            },
            group: "table_cell",
            parseDOM: [{ 
                tag: "td",
                getAttrs(dom) {
                    return {
                        style: dom.getAttribute('style') || null,
                    };
                },  
            }],
            toDOM(node) {
                //const attrs = { class: node.attrs.class };
                return ["td",{
                    style: node.attrs.style || "",
                }, 0];
            },
        },
    };
    

    // Custom table node with header
    const customTableNode = tableNodes({
        tableGroup: "block",
        cellContent: "block+",
        cellAttributes: {
            id: {
                default: null,
                getFromDOM(dom) {
                    return dom.getAttribute('id') || null;
                },
                setDOMAttr(value, attrs) {
                    if (value) attrs.id = value;
                },
            },
            background: {
                default: null,
                getFromDOM(dom) {
                    return (dom.style && dom.style.backgroundColor) || null;
                },
                setDOMAttr(value, attrs) {
                    if (value)
                        attrs.style = (attrs.style || "") + `background-color: ${value};`;
                }
            },

            border: {
                default: null,
                getFromDOM(dom) {
                    return (dom.style && dom.style.border) || null;
                },
                setDOMAttr(value, attrs) {
                    if (value)
                        attrs.style = (attrs.style || "") + `border: ${value};`;
                },
            },
            borderTop: {
                default: null,
                getFromDOM(dom) {
                    return (dom.style && dom.style.borderTop) || null;
                },
                setDOMAttr(value, attrs) {
                    if (value)
                        attrs.style = (attrs.style || "") + `border-top: ${value};`;
                },
            },
            borderRight: {
                default: null,
                getFromDOM(dom) {
                    return (dom.style && dom.style.borderRight) || null;
                },
                setDOMAttr(value, attrs) {
                    if (value)
                        attrs.style = (attrs.style || "") + `border-right: ${value};`;
                },
            },
            borderBottom: {
                default: null,
                getFromDOM(dom) {
                    return (dom.style && dom.style.borderBottom) || null;
                },
                setDOMAttr(value, attrs) {
                    if (value)
                        attrs.style = (attrs.style || "") + `border-bottom: ${value};`;
                },
            },
            borderLeft: {
                default: null,
                getFromDOM(dom) {
                    return (dom.style && dom.style.borderLeft) || null;
                },
                setDOMAttr(value, attrs) {
                    if (value)
                        attrs.style = (attrs.style || "") + `border-left: ${value};`;
                },
            },
            // borderStyle: {
            //     default: null,
            //     getFromDOM(dom) {
            //       return (dom.style && dom.style.borderStyle) || null;
            //     },
            //     setDOMAttr(value, attrs) {
            //       if (value)
            //         attrs.style = (attrs.style || "") + `border-style: ${value};`;
            //     }
            //   },
            //   borderWidth: {
            //     default: null,
            //     getFromDOM(dom) {
            //       return (dom.style && dom.style.borderWidth) || null;
            //     },
            //     setDOMAttr(value, attrs) {
            //       if (value)
            //         attrs.style = (attrs.style || "") + `border-width: ${value};`;
            //     }
            //   },
            //   borderColor: {
            //     default: null,
            //     getFromDOM(dom) {
            //       return (dom.style && dom.style.borderColor) || null;
            //     },
            //     setDOMAttr(value, attrs) {
            //       if (value)
            //         attrs.style = (attrs.style || "") + `border-color: ${value};`;
            //     }
            //   },

        }
    });

    const inputMenuItem = new MenuItem({
        title: 'Insert InputField',
        label: 'Input',
        run: insertInputField,
        //icon: /* Your icon or label for the menu item */,
    });




    const menuItems = [
        inputMenuItem,

        new MenuItem({
            title: 'Bold',
            label: 'Bold',
            run: (state, dispatch) => {
                // Implement command to toggle bold formatting
                toggleMark(basicSchema.marks.strong)(state, dispatch);

            }
        }),
        new MenuItem({
            title: 'Italic',
            label: 'Italic',
            run: (state, dispatch) => {
                // Implement command to toggle italic formatting
                toggleMark(basicSchema.marks.em)(state, dispatch);

            }
        })
    ];
    // Create a dropdown menu
    const dropdown = new Dropdown(menuItems, { label: 'Format' });

    const menu = menuBar({ floating: true, content: [[dropdown]] });

    const domParser = new DOMParser();

    //let htmlString = "<div>Nodata</div>";
    //const [parsedContent, setParsedContent] = useState(null);

    //if (templateState[id]) {
    console.log("read DOCX")

    //setParsedContent(parser.parse(domElement));

    //const extendedNodes = { ...nodes, ...customInputNode, ...customTableNode };
    //const extendedMarks = { ...marks };
    // Add a new span node

    /*
        const customSpanNode = {
            span: {
                inline: true,
                group: 'inline',
                content: 'inline*',
                attrs: {
                    type: { default: 'text' },
                    id: { default: '' },
                    style: { default: '' },
    
                },
                parseDOM: [{
                    tag: 'span',
                    getAttrs: (node) => ({
                        type: node.getAttribute('type'),
                        id: node.getAttribute('id'),
                        style: node.getAttribute('style'), // Added this line
                    }),
                }],
                toDOM: (node) => {
                    
                    const spanAttrs = { 
                        id: node.attrs.id,
                        style: node.attrs.style, // Added this lin
                    };
                    const spanContent = node.textContent;
    
                    return ['span', spanAttrs, spanContent];
                },
            },
        };
    */
    const customSpanMark = {
        span: {
            attrs: {
                id: { default: '' },
                style: { default: '' },
            },
            parseDOM: [{
                tag: 'span',
                getAttrs: (node) => ({
                    id: node.getAttribute('id'),
                    style: node.getAttribute('style'),
                }),
            }],
            toDOM: (mark) => {
                const spanAttrs = {
                    id: mark.attrs.id,
                    style: mark.attrs.style,
                };

                return ['span', spanAttrs, 0];
            },
        },
    };
    //   const customSpanNode = {
    //     span: {
    //       inline: true,
    //       group: 'inline',
    //       parseDOM: [{ tag: 'span' }],
    //       toDOM() {
    //         return ['span', 0];
    //       },
    //     },
    //   };


    // Extend the basicNodes
    // const extendedNodes = {
    //     ...basicNodes,
    //     ...customSpanNode,

    // };

    const extendedSchema = new Schema({
        nodes: { ...basicNodes, ...customInputNode, ...newCustomTableNode },
        marks: { ...marks, ...customSpanMark, ...{} },
    });

    // Define the command
    function insertInputField(state, dispatch) {
        // Create a new 'input' node
        const inputNode = extendedSchema.nodes.input.create({ id: "myInput", value: "someValue", disabled: true });

        // Insert the 'input' node at the current selection
        const tr = state.tr.replaceSelectionWith(inputNode);

        // Apply the transaction
        if (dispatch) dispatch(tr);
    }


    let htmlString = templateState[id];
    //}
    const domElement = domParser.parseFromString(
        htmlString,
        'text/html'
    ).documentElement;
    console.log(domElement);

    const parser = PDOMParser.fromSchema(extendedSchema);
    let parsedContent = parser.parse(domElement);

    const [editorState, setEditorState] = useState(

        EditorState.create({

            schema: extendedSchema,
            doc: parsedContent,
            plugins: [
                menu,
                keymap(baseKeymap),
            ],
        })
    );





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
