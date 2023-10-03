import React, { useEffect } from 'react';
import MdFunctions from './customtags/MdFunctions';


export default function Editor({ editorReady }) {
  useEffect(() => {
    if(editorReady){
      //MdFunctions.registerEvents('markedHTMLViewer');
      MdFunctions.implmentEvents('Editor')
    }
  }, [editorReady]); // The second argument is an array of dependencies

    return (
    <div 
      id="Editor" 
      style={{height: '100%', boxSizing: 'border-box',  display: 'flex' , wordBreak: 'break-word', flexDirection: 'column' }}
    >
    </div>
  );
};
