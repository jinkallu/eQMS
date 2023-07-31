import React from 'react';

export default function MarkedHTMLViewer({ inputText }) {
    return (
    <div 
      id="markedHTMLViewer" 
      dangerouslySetInnerHTML={{ __html: inputText }} 
      style={{boxSizing: 'border-box',  display: 'flex' , wordBreak: 'break-word', flexDirection: 'column' }}
    >
    </div>
  );
};
