import { mergeAttributes, Node } from "@tiptap/core";

import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
const defaultTableRowStyle = "border: 1px solid black;";
const defaultTableStyle = " border-collapse: collapse;width:100%";

const CustomTable = Table.extend({
  addAttributes() {
    return {
      style: {
        default: defaultTableStyle,
        // Customize the HTML parsing (for example, to load the initial content)
        parseHTML: (element) => element.getAttribute("style"),
        // … and customize the HTML rendering.
        renderHTML: (attributes) => {
          return {
            style: defaultTableStyle + attributes.style,
          };
        },
      },
    };
  },
});

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      style: {
        default: defaultTableRowStyle,
        // Customize the HTML parsing (for example, to load the initial content)
        parseHTML: (element) => element.getAttribute("style"),
        // … and customize the HTML rendering.
        renderHTML: (attributes) => {
          return {
            style: defaultTableRowStyle + attributes.style,
          };
        },
      },
    };
  },
});

const CustomTableRow = TableRow.extend({
  addAttributes() {
    return {
      style: {
        default: defaultTableRowStyle,
        // Customize the HTML parsing (for example, to load the initial content)
        parseHTML: (element) => element.getAttribute("style"),
        // … and customize the HTML rendering.
        renderHTML: (attributes) => {
          return {
            style: defaultTableRowStyle + attributes.style,
          };
        },
      },
    };
  },
});

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      style: {
        default: defaultTableRowStyle,
        // Customize the HTML parsing (for example, to load the initial content)
        parseHTML: (element) => element.getAttribute("style"),
        // … and customize the HTML rendering.
        renderHTML: (attributes) => {
          return {
            style: defaultTableRowStyle + attributes.style,
          };
        },
      },
    };
  },
});

export { CustomTableRow, CustomTableCell, CustomTableHeader, CustomTable };
