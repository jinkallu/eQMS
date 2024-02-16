import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import useProgramEvaluator from "../useProgramEvaluator";
import DisplayTable from "./DisplayTable";
import { useExtnStore } from "../../../../zustand/store";

export default function DisplayTableTagView({ element, order, id }) {
  //const [options, setOptions] = useState();
  const [dependStates, setDependStates] = useState({});
  const { templateState, setTemplateState } = useExtnStore((state) => state);
  const { dependStateIds, options, evaluate } =
    useProgramEvaluator(templateState);

  function handleChangeFun(e) {
    setTemplateState(id, e.target.value);
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
      const newValue = templateState[key];
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
  }, [templateState]);

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
          value={templateState[id] || val}
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
      component = <DisplayTable id={id} options={options} />;

      break;
    case "last":
      if (templateState) {
        if (templateState[id]) {
          component = <span>{templateState[id]}</span>;
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
