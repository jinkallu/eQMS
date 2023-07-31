import React from 'react';

export default function MarkedEditor({ inputText, setInputText }) {
    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    return (
    <div id="markedEditor" style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <h1>Markdown Editor</h1>
        <textarea
            value={inputText} 
            onChange={handleInputChange}
            style={{ height: '100%', boxSizing: 'border-box' }}    
        />
    </div>
  );
};
