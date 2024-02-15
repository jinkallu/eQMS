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

    const customTextInlineNode = {
        inlinetext: {
            inline: true,
            group: 'inline',
            attrs: {
                type: { default: 'text' },
                value: { default: '' },
                id: { default: '' },
                disabled: { default: false },
            },
            parseDOM: [{
                tag: 'textarea',
                getAttrs: (node) => ({
                    type: node.getAttribute('type'),
                    value: node.getAttribute('value'),
                    id: node.getAttribute('id'),
                    disabled: node.hasAttribute('disabled'),
                }),
            }],
            toDOM: (node) => {
                const dom = document.createElement('textarea');
                dom.setAttribute('id', node.attrs.id);
                dom.setAttribute('value', node.attrs.value);

                if (node.attrs.disabled) {
                    dom.setAttribute('disabled', '');
                }

                return dom;
            },
        },
    };

    const customTextBlockeNode = {
        blocktext: {
            //inline: true,
            group: 'block',
            attrs: {
                type: { default: 'text' },
                value: { default: '' },
                id: { default: '' },
                disabled: { default: false },
            },
            parseDOM: [{
                tag: 'textarea',
                getAttrs: (node) => ({
                    type: node.getAttribute('type'),
                    value: node.getAttribute('value'),
                    id: node.getAttribute('id'),
                    disabled: node.hasAttribute('disabled'),
                }),
            }],
            toDOM: (node) => {
                const dom = document.createElement('textarea');
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
                return ["tr", {
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
                return ["td", {
                    style: node.attrs.style || "",
                }, 0];
            },
        },
    };


    const inputMenuItem = new MenuItem({
        title: 'Insert InputField',
        label: 'Input',
        run: insertInputField,
        //icon: /* Your icon or label for the menu item */,
    });

    const inlineTextMenuItem = new MenuItem({
        title: 'Insert Inline Text Area',
        label: 'Inline Text Area',
        run: insertInlineText,
        //icon: /* Your icon or label for the menu item */,
    });

    const blockTextMenuItem = new MenuItem({
        title: 'Insert Block Text Area',
        label: 'Block  Text Area',
        run: insertBlockText,
        //icon: /* Your icon or label for the menu item */,
    });




    const menuItems = [
        inputMenuItem,
        inputMenuItem,
        inlineTextMenuItem,
        blockTextMenuItem,

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

    const customParagraphNode: NodeSpec = {
        ...basicNodes.paragraph,
        attrs: {
            ...basicNodes.paragraph.attrs,
            style: { default: '' },
        },
        parseDOM: [{
            tag: 'p',
            getAttrs: (node) => {
                let style: string | null = null;
                if (typeof node !== 'string' && node instanceof HTMLElement) {
                    style = node.getAttribute('style');
                }
                return {
                    ...basicNodes.paragraph.attrs,
                    style: style ? style : '',
                };
            },
        }],
        toDOM: (node) => {

            return ['p', { ...node.attrs, style: node.attrs.style }, 0];
        },
    };


    const extendedSchema = new Schema({
        nodes: { ...basicNodes, ...customInputNode, ...customTextInlineNode, ...customTextBlockeNode, ...newCustomTableNode, paragraph: customParagraphNode },
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

    // Define the command
    function insertInlineText(state, dispatch) {
        // Create a new 'input' node
        const inputNode = extendedSchema.nodes.inlinetext.create({ id: "inlineText", value: "Inline Text Area", disabled: true });

        // Insert the 'input' node at the current selection
        const tr = state.tr.replaceSelectionWith(inputNode);

        // Apply the transaction
        if (dispatch) dispatch(tr);
    }

    // Define the command
    function insertBlockText(state, dispatch) {
        // Create a new 'input' node
        const inputNode = extendedSchema.nodes.blocktext.create({ id: "blockText", value: "Block Text Area", disabled: true });

        // Insert the 'input' node at the current selection
        const tr = state.tr.replaceSelectionWith(inputNode);

        // Apply the transaction
        if (dispatch) dispatch(tr);
    }



    let htmlString = templateState[id];
    console.log(htmlString);
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

            // without default menubar
            // schema: extendedSchema,
            // doc: parsedContent,
            // plugins: [
            //     menu,
            //     keymap(baseKeymap),
            // ]

            schema: extendedSchema,
            doc: parsedContent,
            plugins: [
                menu,
                keymap(baseKeymap),
            ].concat(exampleSetup({ schema: extendedSchema })),
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
