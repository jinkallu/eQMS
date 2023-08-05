import React, { useState, useEffect, useRef } from 'react';
import useMarkdToHTML from './useMarkdToHTML';

import MarkedEditor from "./MarkedEditor";
import MarkedHTMLViewer from "./MarkedHTMLViewer";
import DisplayTasksRenderer from './DisplayTasksRenderer';




export default function MarkedEditView() {
    const [inputText, setInputText] = useState('');
    const [parsedHTML, setParsedHTML] = useState('');

    const { loadingHTML, markdToCustom } = useMarkdToHTML();

    useEffect(() => {

        function parseMarkdown() {

            if (inputText && inputText.trim() !== '') {
                const childHTMLDOM = markdToCustom(inputText, 'markedHTMLViewer');
            }
        }

        // Call the parseMarkdown function whenever inputText changes
        parseMarkdown();
    }, [inputText]);

    return (
        <div id="MarkedEditView" style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 1 }}>
                <MarkedEditor inputText={inputText} setInputText={setInputText} />
            </div>

            <div style={{ flex: 1, height: '100%' }}>
                <h1>HTML Viewer</h1>
                <div
                    id="markedHTMLViewerP"
                    style={{ height: '100%', padding: '16px', boxSizing: 'border-box' }}
                >
                    {/* Render the MarkedHTMLViewer component with the resolved HTML */}
                    <MarkedHTMLViewer inputText={parsedHTML} />
                </div>
            </div>
        </div>
    );
}
