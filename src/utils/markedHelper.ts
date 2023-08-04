import { marked } from "marked";

async function markedToHtml(markedText) {
  try {
    return await marked.parse(markedText);
  } catch (e) {
    return "";
  }
}

export { markedToHtml };
