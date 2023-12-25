import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import useProgramEvaluator from "./useProgramEvaluator";
import Radios from "./Radios";
import { use } from "cytoscape";

export default function ChainedOptionTagView({
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

  useEffect(() => {
    if (options) {
      if (!options.value) {
        return;
      }
      if (options.value.length <= 0) {
        return;
      }

      if (options.value[0] === null) {
        return;
      }
      try{
        handleChange(id, { value: options?.value[0]?.textContent.trim(), label: options?.label[0]?.textContent.trim() });
      }
      catch{
        handleChange(id, { value: options?.value, label: options?.label});
      }
      console.log(options)
      //document.getElementById(id).dispatchEvent()
      //state[id] = {value: options?.value[0]?.textContent.trim(), label: options?.label[0]?.textContent.trim()};
      //state[id]['label'] = options?.label[0]?.textContent.trim();
    }
  }, [options])

  // The following code must be executed dynamically,
  // especially to identify the independant elements.

  useEffect(() => {
    if (!state) {
      return;
    }
    console.log(state)
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
      component = (
        <Radios
          state={state}
          id={id}
          handleChange={handleChange}
          options={options}
        />
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
