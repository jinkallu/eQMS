import { marked } from 'marked'; // Import marked without curly braces

class EditorSave {

    static findEditableMds(markdown: string, editorId: string) {
        let md = markdown;
        const mdTextAreaElements = EditorSave.findTextAreas(editorId);
        for (let i = 0; i < mdTextAreaElements.length; i++) {
            const md_id = mdTextAreaElements[i].id.replace(/_textarea$/, "");
            console.log(md_id);
            //const regexPattern = `<md[^>]*?(?:level=1|id=${md_id})[^>]*?>([\s\S]*?)<\/md>`;
            const regexPattern = `<md(?=[^>]*?\\blevel=1\\b)(?=[^>]*?\\bid=${md_id}\\b)[^>]*?>([\\s\\S]*?)`;
            const regex = new RegExp(regexPattern, 'g');

            const match = regex.exec(md);
            console.log(match);
            if (match !== null) {
                const matchedTag = match[0];
                const openClosePos = EditorSave.findClosingTag(md, matchedTag);
                md = md.substring(0, openClosePos[0] + matchedTag.length) + "\n" + mdTextAreaElements[i].value + "\n" + md.substring(openClosePos[1]);

            }
        }
        //console.log(md);
        md = EditorSave.getInputValuesFromHTMLEditor(md);
        return md;
    }

    static getInputValuesFromHTMLEditor(md: string) {
        var inputTagRegex = /<input[^>]*>/g;

        const parentDiv = document.getElementById("HTMLEditor");
        var inputElements = parentDiv.querySelectorAll("input");

        let match;
        let index = 0;
        while ((match = inputTagRegex.exec(md)) !== null) {
            // Find the starting index of the current <input> tag
            let startIndex = match.index;
            let endIndex = startIndex + match[0].length;
            let inputTagStr = md.substring(startIndex, endIndex);
            var valueAttributeRegex = /value=['"](.*?)['"]/i;
            const newValue = inputElements[index].value;
            console.log(inputElements[index]);

            let matchValue = inputTagStr.match(valueAttributeRegex);
            let modifiedHtmlString;
            if (matchValue) {
                modifiedHtmlString = inputTagStr.replace(valueAttributeRegex, ' value="' + newValue + '"');
            }
            else {
                let insertionIndex = inputTagStr.length - 1;
                var firstPart = inputTagStr.slice(0, insertionIndex);
                var secondPart = inputTagStr.slice(insertionIndex);
                modifiedHtmlString = firstPart + ' value="' + newValue + '"' + secondPart;
            }

            //let insertionIndex = inputTagStr.length - 1;
            var firstPart = md.slice(0, startIndex);
            var secondPart = md.slice(endIndex);
            md = firstPart + modifiedHtmlString + secondPart;
            //console.log(index, modifiedHtmlString);

            index++;
        }


        
        //console.log(md);
        return md;
    }

    static findClosingTag(markdown, openingTag) {
        let openPosition = markdown.indexOf(openingTag);
        console.log(openPosition);

        // Step 2: Search for the next </md> tag
        if (openPosition !== -1) {
            let openTags = 1;
            let closeTags = 0;
            let currentPosition = openPosition;
            let closePosition = null;
            while (openTags !== closeTags && closePosition !== -1) {
                closePosition = markdown.indexOf('</md>', currentPosition + 1);

                if (closePosition !== -1) {
                    closeTags += 1;
                    // Step 3: Check if there is an <md> open tag in between
                    const substring = markdown.substring(currentPosition + 1, closePosition);
                    const nestedMatches = substring.match(/<md[^>]*>/g);

                    console.log(substring);

                    if (nestedMatches) {
                        openTags += nestedMatches.length;
                        currentPosition = closePosition;
                    }
                }
            }
            if (closePosition !== null) {
                const matchedContent = markdown.substring(openPosition, closePosition + 6);
                console.log(matchedContent); // Output the matched content
                return [openPosition, closePosition];
            }
        }
        return null;
    }


    static findTextAreas(editorId: string) {
        const editDiv = document.getElementById("Editor");
        const mdTextAreaElements = editDiv.querySelectorAll('textarea');
        console.log(mdTextAreaElements);
        return mdTextAreaElements;
    }
}

export default EditorSave;