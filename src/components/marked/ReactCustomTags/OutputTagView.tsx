import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import useProgramEvaluator from "./useProgramEvaluator";
import Radios from "./Radios";

export default function OutputTagView({
  element,
  order,
  state,
  id,
  handleChange,
}) {
  //const [options, setOptions] = useState();
  const [dependStates, setDependStates] = useState({});
  const { dependStateIds, options, evaluate } = useProgramEvaluator(state);

  function handleChangeFun(e) {
    if (handleChange) {
      handleChange(id, e.target.value);
    }
  }

  useEffect(() => {
    switch (order) {
      case "middle":
        try {
          let programAttribute = element.getAttribute("program");
          evaluate(programAttribute);
        } catch (error) {
          console.log(error);
        }
        break;
    }
  }, []);

  // The following code must be executed dynamically,
  // especially to identify the independant elements.

  useEffect(() => {
    let trigger = false;
    for (let i = 0; i < dependStateIds.length; i++) {
      const key = dependStateIds[i];
      const newValue = state[key];
      const oldValue = dependStates[key];
      if (newValue !== oldValue) {
        trigger = true;
        setDependStates((prevState) => ({
          ...prevState,
          [key]: newValue,
        }));
      }
    }
    if (trigger) {
      let programAttribute = element.getAttribute("program");
      evaluate(programAttribute);
    }
  }, [state]);

  useEffect(() => {
    if (!dependStateIds) {
      return;
    }

    const newDpdStates = {};
    for (let i = 0; i < dependStateIds.length; i++) {
      newDpdStates[dependStateIds[i]] = null;
    }
    console.log(dependStateIds);
    setDependStates(newDpdStates);
  }, [dependStateIds]);

  function parseStyles(styleString) {
    const stylesArray = styleString.split(';').filter(Boolean);
    const stylesObject = {};
  
    stylesArray.forEach(style => {
      const [property, value] = style.split(':').map(s => s.trim());
      stylesObject[property] = value;
    });
  
    return stylesObject;
  }

  //const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  let component;
  const val = element.getAttribute("value");
  switch (order) {
    case "first":
      //component = element.outerHTML;
      component = (
        <input
          value={state[id].value || val}
          onChange={handleChangeFun}
        ></input>
      );

      break;
    case "middle":
      //let options = {};
      let fieldNames = null;
      if (options) {
        fieldNames = Object.keys(options);
      }
      console.log(options);
      let style = null;
      if(options?.value?.length > 0){
        style = options?.value?.[0].getAttribute('style');
      }

      component = (
        <>
        {options && options.value?.length>0 &&
        <span id={id} style={style? parseStyles(style): null} data-type="output">{options?.value[0].textContent.trim()}</span>
        }
        </>
      );

      // component = (
      //   <>
      //     {/* {options && <p>Select {fieldNames[0]}:</p>} */}
      //     {options && options.value?.map((option, index) => (
      //       <label key={option}>
      //         <input
      //           type="radio"
      //           value={option}
      //           checked={state[id] === option}
      //           onChange={handleChangeFun}
      //           id={element.id}
      //         />
      //         {options.label?.[index]}
      //       </label>
      //     ))}
      //   </>
      // );
      break;
    case "last":
      if (state) {
        if (state[id]) {
          component = <span>{state[id].label}</span>;
        }
        // else {
        //   component = <span>{val}</span>;
        // }
      }
      // else {
      //   component = <span>{val}</span>;
      // }

      //component = <input value={state[id]} onChange={handleChangeFun}></input>;

      break;
    default:
      component = <span>"Error";</span>;
      break;
  }
  return component;
}
