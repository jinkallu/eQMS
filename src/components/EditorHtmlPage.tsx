import { useEffect } from "react";
import { useExtnStore } from "../zustand/store";
import { PIXELTOCM, pageWidths } from "../constants";

export default function EditorHtmlPage() {
  const { editorState, setEditorState } = useExtnStore();

  const html = new DOMParser().parseFromString(editorState, "text/html");

  function checkAndAddPage(htmlDiv: HTMLElement) {
    const pages = htmlDiv.getElementsByClassName("pageview");
    // Array.from(pages)?.map((child) => {
    //   console.log(child.classList);
    //   if (child.classList.contains("pageview")) {
    //     console.log(child.clientHeight);
    //   }
    // });
    // const pages = document.getElementsByClassName("pageview");
    const selectedPageSize = pageWidths?.find((item) => item.type === "A4");
    Array.from(pages)?.forEach((page, index, pg) => {
      const pageHeigtPixel = pg[index].clientHeight;
      const pageHeightCM = pageHeigtPixel * PIXELTOCM;
      console.log(pageHeightCM);
      if (pageHeightCM > selectedPageSize.heightCM) {
        console.log("page size is greater than ...");
        console.log(page);

        let nextPage: Element;
        // do {
        if (Array.from(pages)?.length > index + 1) {
          nextPage = pg[index + 1];
        } else {
          const newEl = document.createElement("div");
          newEl.setAttribute("class", "pageview");
          nextPage = newEl;
          htmlDiv.children[0].appendChild(nextPage);
        }
        const lastChild = page.lastChild;

        nextPage.prepend(lastChild);
        console.log(lastChild);
        console.log(nextPage);
        console.log(pg[index]);
        try {
          page.removeChild(lastChild);
        } catch (e) {
          console.log(e);
        }
        // } while (pageHeightCM > selectedPageSize.heightCM);
        return checkAndAddPage(htmlDiv);
      }
    });

    return htmlDiv;
  }

  useEffect(() => {
    const htmlDiv = document.getElementById("customsethtml");
    const res = checkAndAddPage(htmlDiv);
    console.log(res);
  }, [editorState]);
  return (
    <div
      id="customsethtml"
      dangerouslySetInnerHTML={{
        __html: html?.body?.innerHTML || "<h1>Loading</h1>",
      }}
    ></div>
  );
}
