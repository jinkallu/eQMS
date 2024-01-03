import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { useExtnStore } from "../../../zustand/store";

export default function InputTagViewer({ element, order, id, val }) {
  const { templateState, setTemplateState } = useExtnStore((state) => state);
  function handleChangeFun(e) {
    setTemplateState(id, e.target.value);
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
        <input
          value={templateState[id] || val}
          onChange={handleChangeFun}
        ></input>
      );

      break;
    case "middle":
      component = (
        <input
          value={(templateState && templateState[id]) || val}
          id={element.id}
          onChange={handleChangeFun}
        ></input>
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
