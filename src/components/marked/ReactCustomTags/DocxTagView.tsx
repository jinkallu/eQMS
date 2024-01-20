import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useExtnStore } from "../../../zustand/store";
//import * as cheerio from 'cheerio';
import JSZip from 'jszip';
import { EditorState, Transaction } from "prosemirror-state";
import { ProseMirror } from "@nytimes/react-prosemirror";
import { schema } from "prosemirror-schema-basic"
import { exampleSetup } from 'prosemirror-example-setup';
//import './ProseMirrorStyles.css'; // Import the CSS file here
import { toggleMark } from 'prosemirror-commands'; // Import toggleMark here
import { EditorView } from "prosemirror-view"; // Import EditorView from prosemirror-view
import ProseEditor from "./ProseEditor";






export default function DocxTagViewer({ element, order, id }) {

    const { templateState, setTemplateState } = useExtnStore((state) => state);
    function handleChangeFun(e) {
        setTemplateState(id, e.target.value);
    }

    function convertToHTML(xmlDoc) {
        if (!xmlDoc || !xmlDoc.documentElement) {
            console.log("Error! Not XML");
            return ''; // Handle cases where the XML structure is not as expected
        }

        const wNamespaceURI = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
        const body = xmlDoc.getElementsByTagNameNS(wNamespaceURI, 'body')[0]; // Use correct namespace and local name

        if (!body) {
            console.log("Error! No Body");
            return '';
        }

        return convertNodeToHTML(body);
    }

    function convertNodeToHTML(node) {
        if (!node) {
            return '';
        }

        let htmlContent = '';
        for (const child of node.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                htmlContent += convertElementToHTML(child);
            } else if (child.nodeType === Node.TEXT_NODE) {
                htmlContent += child.nodeValue;
            }
        }

        return htmlContent;
    }


    function convertElementToHTML(element) {
        if (!element) {
            return '';
        }

        let htmlContent = '';
        const tagName = element.tagName.toLowerCase();

        switch (tagName) {
            case 'w:p':
                htmlContent += `<p>${convertNodeToHTML(element)}</p>`;
                break;
            case 'w:r':
                htmlContent += convertNodeToHTML(element);
                break;
            case 'w:t':
                htmlContent += `<span>${element.textContent}</span>`;
                break;
            case 'w:tbl':
                htmlContent += convertTableToHTML(element);
                break;
            // Handle other XML elements as needed
            default:
                htmlContent += convertNodeToHTML(element);
        }

        return htmlContent;
    }

    function convertTableToHTML(tableElement) {
        if (!tableElement) {
            return '';
        }
        const wNamespaceURI = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
        //const body = xmlDoc.getElementsByTagNameNS(wNamespaceURI, 'body')[0];
        const tableProperties = tableElement.getElementsByTagNameNS(wNamespaceURI, 'tblPr')[0];
        const tableStyles = extractTableStyles(tableProperties);

        const tableHVStyles = exctractTableInsideVHStyles(tableProperties);

        let htmlContent = `<table${tableStyles}>`;
        let flagFirstRow = true;
        for (const rowElement of tableElement.getElementsByTagNameNS(wNamespaceURI, 'tr')) {
            htmlContent += '<tr>';
            // for (const cellElement of rowElement.getElementsByTagNameNS(wNamespaceURI, 'tc')) {
            const cellElements = rowElement.getElementsByTagNameNS(wNamespaceURI, 'tc');
            for (let j = 0; j < cellElements.length; j++) {
                const cellProperties = cellElements[j].getElementsByTagNameNS(wNamespaceURI, 'tcPr')[0];
                const cellStyles = convertTableCellPropertiesToHTMLStyle(cellProperties);
                let vhStyles = '';
                if (flagFirstRow) {
                    if (j !== cellElements.length - 1) {
                        vhStyles = tableHVStyles.insideV;
                    }

                }
                else {
                    if (j === cellElements.length - 1) {
                        vhStyles = tableHVStyles.insideH;
                    }
                    else {
                        vhStyles = tableHVStyles.insideV + ' ' + tableHVStyles.insideH;
                    }
                }
                htmlContent += `<td style="${cellStyles} ${vhStyles}">${convertNodeToHTML(cellElements[j])}</td>`;
            }
            htmlContent += '</tr>';
            flagFirstRow = false;
        }
        htmlContent += '</table>';

        return htmlContent;
    }

    function exctractTableInsideVHStyles(tableProperties) {
        if (!tableProperties) {
            return '';
        }
        const wNamespaceURI = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
        const borderStyles = extractInsideVHStyles(tableProperties.getElementsByTagNameNS(wNamespaceURI, 'tblBorders')[0]);

        return borderStyles;
    }

    function extractInsideVHStyles(bordersElement) {
        if (!bordersElement) {
            return '';
        }

        const borderStyles = { insideH: null, insideV: null };
        const wNamespaceURI = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

        // Extract individual border styles
        const borderTypes = ['insideH', 'insideV'];
        for (const borderType of borderTypes) {
            const borderElement = bordersElement.getElementsByTagNameNS(wNamespaceURI, borderType)[0];
            console.log(borderElement);
            if (borderElement) {
                const val = wValToHtmlVal(borderElement.getAttribute('w:val'));
                const sz = borderElement.getAttribute('w:sz');
                const color = wColorToHtmlVal(borderElement.getAttribute('w:color'));
                console.log(val, sz, color);
                if (val && sz && color) {
                    if (borderType === "insideH") {
                        borderStyles.insideH = `border-top: ${val} ${sz}px #${color};`;
                    }
                    else if (borderType === "insideV") {
                        borderStyles.insideV = `border-right: ${val} ${sz}px #${color};`;
                    }
                }
            }
        }

        return borderStyles;
    }

    function extractTableStyles(tableProperties) {
        if (!tableProperties) {
            return '';
        }
        const wNamespaceURI = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
        const borderStyles = extractBorderStyles(tableProperties.getElementsByTagNameNS(wNamespaceURI, 'tblBorders')[0]);

        return ` style="${borderStyles}"`;
    }

    // Example function to extract border styles from DOCX table
    function extractBorderStyles(bordersElement) {
        if (!bordersElement) {
            return '';
        }

        const borderStyles = [];
        const wNamespaceURI = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

        // Extract individual border styles
        const borderTypes = ['top', 'left', 'bottom', 'right'];
        for (const borderType of borderTypes) {
            const borderElement = bordersElement.getElementsByTagNameNS(wNamespaceURI, borderType)[0];
            console.log(borderElement);
            if (borderElement) {
                const val = wValToHtmlVal(borderElement.getAttribute('w:val'));
                const sz = borderElement.getAttribute('w:sz');
                const color = wColorToHtmlVal(borderElement.getAttribute('w:color'));
                console.log(val, sz, color);
                if (val && sz && color) {
                    borderStyles.push(`border-${borderType}: ${val} ${sz}px #${color};`);
                }
            }
        }

        return borderStyles.join(' ');
    }

    function convertTableCellPropertiesToHTMLStyle(tcPrElement) {
        if (!tcPrElement) {
            return '';
        }
        const wNamespaceURI = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

        const styles = [];

        // Extract cell width
        const tcWElement = tcPrElement.getElementsByTagNameNS(wNamespaceURI, 'tcW')[0];
        if (tcWElement) {
            const width = tcWElement.getAttribute('w:w');
            const type = tcWElement.getAttribute('w:type');

            if (width && type === 'dxa') {
                styles.push(`width: ${width}px;`);
            }
        }

        // Extract cell shading
        const shdElement = tcPrElement.getElementsByTagNameNS(wNamespaceURI, 'shd')[0];
        if (shdElement) {
            const shdVal = shdElement.getAttribute('w:val');
            const shdColor = shdElement.getAttribute('w:color');
            const shdFill = shdElement.getAttribute('w:fill');

            if (shdVal === 'solid' && shdColor && shdFill) {
                styles.push(`background-color: #${shdFill};`);
                styles.push(`color: #${shdColor};`);
            }
        }

        return styles.join(' ');
    }

    function wValToHtmlVal(wval) {
        switch (wval) {
            case 'single':
                return 'solid';
            default:
                return wval;
        }
    }

    function wColorToHtmlVal(wcolor) {
        switch (wcolor) {
            case 'auto':
                return '000000';
            default:
                return wcolor;
        }
    }


    async function handleFileChange(event) {
        const file = event.target.files[0];

        if (file) {
            try {
                const zip = await JSZip.loadAsync(file);
                const documentXml = await zip.file('word/document.xml').async('string');
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(documentXml, 'text/xml');
                console.log('Parsed XML:', xmlDoc);
                const htmlContent = convertToHTML(xmlDoc);
                console.log('Generated HTML:', htmlContent);
                const parserHTML = new DOMParser();
                const html = parserHTML.parseFromString(documentXml, 'text/html');
                setTemplateState(id, htmlContent);

                // Now you have the content of document.xml
                //console.log('Content of document.xml:', documentXml);
            } catch (error) {
                console.error('Error reading DOCX file:', error);
            }
        }
    }





    let component;

    switch (order) {
        case "first":



            component = (
                <h1>DocX</h1>
            );

            break;
        case "middle":

            component = (
                <div>
                    <h2>Open Docx</h2>
                    <input type="file" onChange={handleFileChange} />
                </div>
            );
            break;
        case "last":

            /*
                 const $ = cheerio.load(doc, {
                    xmlMode: true
                  });
              
                  // Extract text
                  let out = [];
                  $('w\\:t').each((i, el) => {
                    out.push($(el).text());
                  });
              
                  console.log(out);*/

            component = (
                <div>
                    <ProseEditor id={id} element={element} order={order}></ProseEditor>
                    <div dangerouslySetInnerHTML={{ __html: templateState[id] }}></div>
                </div>
            );
            //component = <input value={templateState[id]} onChange={handleChangeFun}></input>;

            break;
        default:
            component = <span>"Error";</span>;
            break;
    }
    return component;
}
