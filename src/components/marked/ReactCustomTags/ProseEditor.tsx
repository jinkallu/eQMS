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


export default function ProseEditor({ element, order, id }) {
    const [mount, setMount] = useState<HTMLElement | null>(null);

    const menuItems = [
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
    
    const defaultContent = schema.node("paragraph", null, [
        schema.text("This is some "),
        schema.text("default", [schema.marks.strong.create()]),
        schema.text(" text."),
          ]);

    const [editorState, setEditorState] = useState(
        
        EditorState.create({
            schema,
            doc: defaultContent,
            plugins: [menu]
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
