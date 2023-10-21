import Grid from "@mui/material/Grid";
export default function GenericTag({
  element,
  order,
  state,
  setState,
  children,
}) {
  const clonedElement = element.cloneNode();

  // Remove the cloned element's children
  while (clonedElement.firstChild) {
    clonedElement.removeChild(clonedElement.firstChild);
  }
  console.log(clonedElement.outerHTML);
  const newEle = (
    <div dangerouslySetInnerHTML={{ __html: clonedElement.outerHTML }}></div>
  );

  return (
    <div>
      {newEle}
      {children}
    </div>
  );
}
