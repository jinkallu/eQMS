import Grid from "@mui/material/Grid";
import { useEffect } from "react";
export default function InputTagViewer({
  element,
  order,
  state,
  id,
  handleChange,
  val,
}) {
  function handleChangeFun(e) {
    if (handleChange) {
      handleChange(id, e.target.value);
    }
  }
  // useEffect(() => {
  //   const val = element.getAttribute("value");
  //   if (id && handleChange) handleChange(id, val || "");
  // }, [element, id, handleChange]);

  let component;
  // console.log(element);
  // const val = element.getAttribute("value");
  // if ((!state || !state[id]) && order !== "last") {
  //   return <span>Loading input</span>;
  // }
  switch (order) {
    case "first":
      //component = element.outerHTML;

      component = (
        <input value={state[id] || val} onChange={handleChangeFun}></input>
      );

      break;
    case "middle":
      component = (
        <input
          value={(state && state[id]) || val}
          id={element.id}
          onChange={handleChangeFun}
        ></input>
      );
      break;
    case "last":
      if (state) {
        if (state[id]) {
          component = <span>{state[id]}</span>;
        } else {
          component = <span>{val}</span>;
        }
      } else {
        component = <span>{val}</span>;
      }

      //component = <input value={state[id]} onChange={handleChangeFun}></input>;

      break;
    default:
      component = <span>"Error";</span>;
      break;
  }
  return component;
}
