import Grid from "@mui/material/Grid";
import { useExtnStore } from "../../../zustand/store";
export default function TextInputTagView({ element, order, id }) {
  const { templateState, setTemplateState } = useExtnStore((store) => store);
  function handleChangeFun(e) {
    setTemplateState(id, e.target.value);
  }
  let component;
  const val = element.getAttribute("value");
  switch (order) {
    case "first":
      //component = element.outerHTML;
      component = (
        <input
          value={(templateState && templateState[id]) || val}
          onChange={handleChangeFun}
        ></input>
      );

      break;
    case "middle":
      const rows = element.getAttribute("rows");
      const cols = element.getAttribute("cols");
      component = (
        <textarea
          value={(templateState && templateState[id]) || val}
          id={element.id}
          cols={cols}
          rows={rows}
          onChange={handleChangeFun}
        ></textarea>
      );
      break;
    case "last":
      if (templateState) {
        if (templateState[id]) {
          component = <span>{templateState[id]}</span>;
        } else {
          component = <span>{val}</span>;
        }
      } else {
        component = <span>{val}</span>;
      }

      //component = <input value={templateState[id]} onChange={handleChangeFun}></input>;

      break;
    default:
      component = <span>"Error";</span>;
      break;
  }
  return component;
}
