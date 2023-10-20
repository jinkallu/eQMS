import MarkedToCustom from "./MarkedToCustom";

export default function RenderDomTree({ element }) {
  //element = element as HTMLElement;
  // If it's an element, create a React component for it
  return <MarkedToCustom element={element} />;
}
