import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useExtnStore } from "../../../zustand/store";
//import * as cheerio from 'cheerio';
import { EditorState, Transaction } from "prosemirror-state";
import { ProseMirror } from "@nytimes/react-prosemirror";
import { schema } from "prosemirror-schema-basic"
import { exampleSetup } from 'prosemirror-example-setup';
//import './ProseMirrorStyles.css'; // Import the CSS file here
import { toggleMark } from 'prosemirror-commands'; // Import toggleMark here
import { EditorView } from "prosemirror-view"; // Import EditorView from prosemirror-view
import { MenuItem, Dropdown, menuBar } from 'prosemirror-menu';
import { Schema, DOMParser as PDOMParser } from "prosemirror-model"
import { addListNodes } from "prosemirror-schema-list"
import 'prosemirror-view/style/prosemirror.css';
import "prosemirror-menu/style/menu.css";
import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'

import {
    addColumnAfter,
    addColumnBefore,
    deleteColumn,
    addRowAfter,
    addRowBefore,
    deleteRow,
    mergeCells,
    splitCell,
    setCellAttr,
    toggleHeaderRow,
    toggleHeaderColumn,
    toggleHeaderCell,
    goToNextCell,
    deleteTable
} from "prosemirror-tables";
import {
    tableEditing,
    columnResizing,
    tableNodes,
    fixTables
} from "prosemirror-tables";




export default function ProseEditor({ element, order, id }) {
    const [mount, setMount] = useState<HTMLElement | null>(null);

    const nodesWithTable = tableNodes({
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
            
        }
    });
    // const extendedSchema = new Schema({
    //     nodes: schema.spec.nodes
    //       .update("table", {
    //         content: "table_row+",
    //         attrs: { id: { default: null } },
    //         parseDOM: [
    //           {
    //             tag: "table",
    //             getAttrs(dom) {
    //                 if (typeof dom === 'object' && dom instanceof HTMLElement) {
    //                     return { id: dom.getAttribute("id") || null };
    //                   }
    //                   return { id: null };
    //             }
    //           }
    //         ],
    //         toDOM(node) {
    //           return ["table", { id: node.attrs.id }, ["tbody", 0]];
    //         }
    //       })
    //       .append(nodesWithTable),
    //     marks: schema.spec.marks
    //   });
    const nodes = {
        doc: { content: 'table+' },
        table: {
          content: 'table_row+',
          tableRole: 'table',
          parseDOM: [{ tag: 'table' }],
          toDOM(node) {
            return ['table', { id: node.attrs.id || 'defaultTableId' }, 0];
          },
          attrs: { id: { default: null } }, // Allow specifying an id attribute
        },
        table_row: {
          content: 'table_cell+',
          tableRole: 'row',
          parseDOM: [{ tag: 'tr' }],
          toDOM() {
            return ['tr', 0];
          },
        },
        table_cell: {
          content: 'inline*',
          tableRole: 'cell',
          parseDOM: [{ tag: 'td' }],
          toDOM() {
            return ['td', 0];
          },
        },
      };

      const extendedSchema = new Schema({
        nodes: schema.spec.nodes.append(nodesWithTable),
        marks: schema.spec.marks,
    });

    // const extendedSchema = new Schema({
    //     nodes: schema.spec.nodes.append(nodesWithTable),
    //     marks: schema.spec.marks,
    // });
    // const extendedSchema = new Schema({
    //     nodes: schema.spec.nodes.append({
    //       table: {
    //         ...nodesWithTable.table,
    //         attrs: {
    //           id: { default: null }, // Default to null if not specified
    //           // Add any other attributes you need here
    //         },
    //       },
    //     }),
    //     marks: schema.spec.marks,
    //   });

    //const extendedNodes = schema.spec.nodes.append(nodesWithTable);

    // const defaultContent = extendedSchema.node('table', null, [
    //     extendedSchema.node('table_row', null, [
    //         extendedSchema.node('table_header', null, [
    //           extendedSchema.text('Header 1')
    //         ]),
    //         extendedSchema.node('table_header', null, [
    //           extendedSchema.text('Header 2')
    //         ]),
    //       ]),
    //     extendedSchema.node('table_row', null, [
    //         extendedSchema.node('table_cell', null, [
    //             extendedSchema.text('Cell 1'),
    //         ]),
    //         extendedSchema.node('table_cell', null, [
    //             extendedSchema.text('Cell 2'),
    //         ]),
    //     ]),
    // ]);


    const nparser = new DOMParser();
    // let defaultContent = PDOMParser.fromSchema(extendedSchema).parse(
    //     nparser.parseFromString(
    //         `<table id= "mytable" style="border: solid 2px">
    //   <tr><th colspan="3" data-colwidth="100,0,0">Wide header</th></tr>
    //   <tr><td>One</td><td>Two</td><td>Three</td></tr>
    //   <tr><td>Four</td><td>Five</td><td>Six</td></tr>
    // </table>`,
    //         "text/xml"
    //     ).documentElement
    // );

    const tableElement = nparser.parseFromString(
        `<table id="mytable" style="border: solid 2px">
          <tr><th colspan="3" data-colwidth="100,0,0">Wide header</th></tr>
          <tr><td>One</td><td>Two</td><td>Three</td></tr>
          <tr><td>Four</td><td>Five</td><td>Six</td></tr>
        </table>`,
        'text/xml'
      ).documentElement;
      
      // Parse the table element
      const parsedTable = PDOMParser.fromSchema(extendedSchema).parse(tableElement);
      
      // Modify the table node to set the id attribute
      const tableNodeWithId = extendedSchema.node('table', { id: 'mytable' }, parsedTable.firstChild.content);
      //const tableNodeWithId = extendedSchema.nodes.table.create({ id: 'mytable' });
      //const tableNodeWithId = extendedSchema.node('table', { id: 'mytable' }, parsedTable.content);

      // Create a new node with the modified table
      const defaultContent = extendedSchema.node('doc', null, tableNodeWithId);



    //   const mySchema = new Schema({
    //     nodes: addListNodes(extendedNodes, 'paragraph block*', 'block'),
    //     marks: schema.spec.marks,
    //   });

    let newschema = new Schema({
        nodes: schema.spec.nodes.append(
            tableNodes({
                tableGroup: "block",
                cellContent: "block+",
                cellAttributes: {
                    background: {
                        default: null,
                        getFromDOM(dom) {
                            return (dom.style && dom.style.backgroundColor) || null;
                        },
                        setDOMAttr(value, attrs) {
                            if (value)
                                attrs.style = (attrs.style || "") + `background-color: ${value};`;
                        }
                    }
                }
            })
        ),
        marks: schema.spec.marks
    });

    // const mySchema = new Schema({
    //     nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    //     marks: schema.spec.marks
    // })

    const parser = new DOMParser();

    function insertTable(state, dispatch) {
        const { selection } = state;
        const table = nodesWithTable.table.createAndFill(
            null,
            Array.from({ length: 3 }, () =>
                nodesWithTable.table_row.createAndFill(
                    null,
                    Array.from({ length: 3 }, () => nodesWithTable.table_cell.create())
                )
            )
        );

        if (dispatch) {
            dispatch(state.tr.replaceSelectionWith(table).scrollIntoView());
        }

        return true;
    }

    const insertSpan = (state, dispatch) => {
        // Here you can customize the content you want to insert
        const spanNode = schema.text('Your Span Content', [schema.marks.span.create()]);

        // Dispatch a transaction to insert the span into the editor
        dispatch(state.tr.replaceSelectionWith(spanNode));
    };

    const spanMenuItem = new MenuItem({
        title: 'Insert Span',
        label: 'Span',
        run: insertSpan,
        select: (state) => toggleMark(schema.marks.span)(state),
        //icon: /* Your icon or label for the menu item */,
    });


    const tableMenuItem = new MenuItem({
        title: 'Insert Table',
        label: 'Table',
        run: insertTable,
    });

    const menuItems = [
        spanMenuItem,
        tableMenuItem,

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

    // Create a menu bar
    // Create a menu bar
    const menu = menuBar({ floating: true, content: [[dropdown]] });

    // const defaultContent = schema.node("paragraph", null, [
    //     schema.text("This is some "),
    //     schema.text("default", [schema.marks.strong.create()]),
    //     schema.text(" text."),
    // ]);


    const [editorState, setEditorState] = useState(

        EditorState.create({

            schema: extendedSchema,
            doc: defaultContent,
            //doc: defaultContent,
            //plugins: [...exampleSetup({ schema: mySchema })]
            plugins: [...exampleSetup({ schema: extendedSchema }), menu, keymap(baseKeymap)],
        })
    );





    const { templateState, setTemplateState } = useExtnStore((state) => state);
    function handleChangeFun(e) {
        setTemplateState(id, e.target.value);
    }

    useEffect(() => {
        if (mount) {
            const view = new EditorView(mount, {
                state: editorState,
                dispatchTransaction: (transaction) => {
                    const newState = view.state.apply(transaction);
                    view.updateState(newState);
                    setEditorState(newState);
                },
            });

            return () => {
                view.destroy();
            };
        }
    }, [editorState, mount]);

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
                // defaultState={EditorState.create({ schema })}
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
