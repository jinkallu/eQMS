import { useState } from "react";

//import DisplayTag from "./useDisplayTag";
//import DiagramTag from "./mxgraphtags/useDiagramTag";
//import CytoscapeTags from "./cytoscapetags/CytoscapeTags";
//import IMGTag from "./htmltags/IMGTag";
//import DocPrefixTag from "./htmltags/DocPrefixTag";
//import DocNumberTag from "./htmltags/DocNumberTag";
//import DocVersionTag from "./htmltags/DocVersionTag";
//import DocNameTag from "./htmltags/DocNameTag";
//import DocLogoTag from "./htmltags/DocLogoTag";
//import useMdTag from "./htmltags/useMdTag";
import useInputTag from "./htmltags/useInputTag";
//import InputTextAreaTag from "./htmltags/InputTextAreaTag";
//import TableTag from "./htmltags/useTableTag";

let isRegistered = false;

const useCustomTags = () => {
    //const {registerAllMdTags} = useMdTag();
    const {registerAllInputTags} = useInputTag();

    const registerCustomTags = () => {
        if (!isRegistered) {

            //DisplayTag.registerCondition();
            //DiagramTag.registerCondition();
            //CytoscapeTags.registerCondition();
            //IMGTag.registerCondition();
            //DocPrefixTag.registerCondition();
            //DocNumberTag.registerCondition();
            //DocVersionTag.registerCondition();
            //DocNameTag.registerCondition();
            //DocLogoTag.registerCondition();
            //registerAllMdTags();
            registerAllInputTags();
            //InputTextAreaTag.register();
            //TableTag.register();

           isRegistered = false;
        }
    }

    return {registerCustomTags};
}

export default useCustomTags;