import DisplayTag from "./DisplayTag";
import DiagramTag from "./mxgraphtags/DiagramTag";
import CytoscapeTags from "./cytoscapetags/CytoscapeTags";
import IMGTag from "./htmltags/IMGTag";
import DocPrefixTag from "./htmltags/DocPrefixTag";
import DocNumberTag from "./htmltags/DocNumberTag";
import DocVersionTag from "./htmltags/DocVersionTag";
import DocNameTag from "./htmltags/DocNameTag";
import DocLogoTag from "./htmltags/DocLogoTag";
import MdTag from "./htmltags/MdTag";
import InputTag from "./htmltags/InputTag";
import InputTextAreaTag from "./htmltags/InputTextAreaTag";
import TableTag from "./htmltags/TableTag";
class CustomTags {
    private static isRegistered = false;

    static registerCustomTags() {
        if (!CustomTags.isRegistered) {

            DisplayTag.registerCondition();
            DiagramTag.registerCondition();
            CytoscapeTags.registerCondition();
            IMGTag.registerCondition();
            DocPrefixTag.registerCondition();
            DocNumberTag.registerCondition();
            DocVersionTag.registerCondition();
            DocNameTag.registerCondition();
            DocLogoTag.registerCondition();
            MdTag.register();
            InputTag.register();
            InputTextAreaTag.register();
            TableTag.register();

            CustomTags.isRegistered = true;
        }
    }
}

export default CustomTags;