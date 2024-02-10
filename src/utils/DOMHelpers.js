function versionIncreaser(htmlString) {
  const html = new DOMParser().parseFromString(htmlString, "text/html");
  const divExtends = html.querySelectorAll("div.extend");
  Array.from(divExtends)?.map((item) => {
    if (item.hasAttribute("version")) {
      const curVersion = item.getAttribute("version");

      item.setAttribute("version", +curVersion + 1);
    }
    return item;
  });
  return html?.body?.innerHTML || "";
}

export { versionIncreaser };
