import Grid from "@mui/material/Grid";
export default function TextInputTagView({
  element,
  order,
  state,
  id,
  handleChange,
}) {
  function handleChangeFun(e) {
    if (handleChange) {
      handleChange(id, e.target.value);
    }
  }
  let component;
  const val = element.getAttribute("value");
  switch (order) {
    case "first":
      //component = element.outerHTML;
      component = (
        <input
          value={(state && state[id]) || val}
          onChange={handleChangeFun}
        ></input>
      );

      break;
    case "middle":
      const rows = element.getAttribute("rows");
      const cols = element.getAttribute("cols");
      component = (
        <textarea
          value={(state && state[id]) || val}
          id={element.id}
          cols={cols}
          rows={rows}
          onChange={handleChangeFun}
        ></textarea>
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
