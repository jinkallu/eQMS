import Grid from "@mui/material/Grid";
import useProgramEvaluator from "./useProgramEvaluator";

export default function ChainedOptionTagView({
  element,
  order,
  state,
  id,
  handleChange,
}) {

  const { evaluate } = useProgramEvaluator();

  function handleChangeFun(e) {
    if (handleChange) {
      handleChange(id, e.target.value);
    }
  }

  //const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];


  let component;
  const val = element.getAttribute("value");
  switch (order) {
    case "first":
      //component = element.outerHTML;
      component = (
        <input value={state[id] || val} onChange={handleChangeFun}></input>
      );

      break;
    case "middle":
      let options = {};
      try {
        let programAttribute = element.getAttribute('program');
        options = evaluate(programAttribute);
        //options = evaluate("value = datafrom(tag=table, id=riskprobability); select(Qualitative, QuantitativeUpperRange); where(Quantitative>1 && Quantitative < 2)");
      }
      catch (error) {
        console.log(error);
      }
      const fieldNames = Object.keys(options);

      component = (
        <>
          <p>Select {fieldNames[0]}:</p>
          {options[fieldNames[0]].map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                checked={state[id] === option}
                onChange={handleChangeFun}
              />
              {option}
            </label>
          ))}
        </>
      );
      break;
    case "last":
      if (state) {
        if (state[id]) {
          component = <span>{state[id]}</span>
        }
        else {
          component = <span>{val}</span>;
        }
      }
      else {
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
