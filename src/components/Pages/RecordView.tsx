import React, { useState, useEffect } from "react";

import useMarkdToHTML from "../marked/useMarkdToHTML";

export default function RecordView({md}){
    const { editorReady, htmlEditorReady, loadingHTML, markdToCustom } = useMarkdToHTML();
    
    useEffect(() => {
        if(md !== null || md !== ''){
            console.log(md);
            markdToCustom(false, md, "RecordView", 3, 0, null);
        }
    }, [md])
    return (
        <div id="RecordView">

        </div>
    );
}
