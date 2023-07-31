import React, { useState } from 'react';
import { marked } from 'marked';


import MarkedEditor from "./MarkedEditor";
import MarkedHTMLViewer from "./MarkedHTMLViewer";


export default function MarkedEditView() {
    const [inputText, setInputText] = useState('');

    return (
    <div id="MarkedEditView" style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: 1 }}>
            <MarkedEditor inputText={inputText} setInputText={setInputText}/>
        </div>
        
        <div style={{ flex: 1, height: '100%' }}>
            <h1>HTML Viewer</h1>
            <div
                id="markedHTMLViewerP"
                style={{ height: '100%', padding: '16px', boxSizing: 'border-box' }}>
                <MarkedHTMLViewer inputText={marked(inputText)} />
            </div>
        </div>
    </div>
  );
};
