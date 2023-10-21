import Grid from "@mui/material/Grid";
export default function InputTagViewer({
  element,
  order,
  state,
  id,
  handleChange,
}) {
  function handleChangeFun(e) {
    handleChange(id, e.target.value);
  }
  let component;
  switch (order) {
    case "first":
      component = element.outerHTML;
      break;
    case "middle":
      component = <input value={state[id]} onChange={handleChangeFun}></input>;
      console.log(component);
      break;
    case "last":
      console.log("last", state);
      component = <span>{state[id]}</span>;
      break;
    default:
      component = <span>"Error";</span>;
      break;
  }
  return component;
}
