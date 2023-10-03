import React, { useEffect } from 'react';
import MdFunctions from './customtags/MdFunctions';


export default function HTMLEditor({ htmlEditorReady }) {
  useEffect(() => {
    if(htmlEditorReady){
      console.log(htmlEditorReady);
      MdFunctions.implmentEvents('HTMLEditor')
    }
  }, [htmlEditorReady]); // The second argument is an array of dependencies

    return (
    <div 
      id="HTMLEditor" 
      //dangerouslySetInnerHTML={{ __html: inputText }} 
      style={{boxSizing: 'border-box',  display: 'flex' , wordBreak: 'break-word', flexDirection: 'column' }}
    >
    </div>
  );
};
