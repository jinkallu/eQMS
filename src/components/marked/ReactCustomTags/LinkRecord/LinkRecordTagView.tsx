import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import useLinkRecordEvaluator from "./useLinkRecordEvaluator";
import Radios from "../Radios";
import CreateLinkRecordModal from "../ProcessFlowView/createLinkRecordModal";

export default function LinkRecordTagView({
  element,
  order,
  state,
  id,
  handleChange,
}) {
  //const [options, setOptions] = useState();
  const [open, setOpen] = useState(false);
  // const [dependStates, setDependStates] = useState({});
  // const { dependStateIds, types, evaluate } = useLinkRecordEvaluator(state);

  function handleChangeFun(e) {
    if (handleChange) {
      handleChange(id, e.target.value);
    }
  }

  // useEffect(() => {
  //   switch (order) {
  //     case "middle":
  //       try {
  //         let programAttribute = element.getAttribute('program');
  //         evaluate(programAttribute);
  //       }
  //       catch (error) {
  //         console.log(error);
  //       }
  //       break;
  //   }
  // }, [])

  // The following code must be executed dynamically,
  // especially to identify the independant elements.

  // useEffect(() => {
  //   let trigger = false;
  //   for (let i = 0; i < dependStateIds.length; i++) {
  //     const key = dependStateIds[i];
  //     const newValue = state[key];
  //     const oldValue = dependStates[key];
  //     if( newValue !== oldValue){
  //       trigger = true;
  //       setDependStates(prevState => ({
  //         ...prevState,
  //         [key]: newValue,
  //       }));
  //     }

  //   }
  //   if(trigger){
  //     let programAttribute = element.getAttribute('program');
  //     evaluate(programAttribute);
  //   }

  // }, [state])

  // useEffect(() => {
  //   if (!dependStateIds) {
  //     return;
  //   }

  //   const newDpdStates = {};
  //   for (let i = 0; i < dependStateIds.length; i++) {
  //     newDpdStates[dependStateIds[i]] = null;
  //   }
  //   console.log(dependStateIds);
  //   setDependStates(newDpdStates);
  // }, [dependStateIds])

  //const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  const typesAttr = element.getAttribute("types");
  const types = typesAttr ? JSON.parse(typesAttr) : [];

  const recAttr = element.getAttribute("records");
  const records = recAttr ? JSON.parse(recAttr) : [];

  const type = [
    {
      sopId: "2c39dfe7-9be6-48c1-92b4-b5b7a733ed17",
      templateId: "29ce92e4-954e-4dad-8bd8-564474994d27",
    },
  ];

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
      //let options = {};
      let fieldNames = null;
      if (types) {
        fieldNames = Object.keys(types);
      }
      console.log(types);
      component = <button onClick={() => setOpen(true)}>LinkedRecords</button>;
      // component = <Radios state = {state} id={id} handleChange={handleChange} options={types}/>

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
      console.log(state[id]);

      if (state) {
        if (state[id]) {
          component = <span>{state[id]}</span>;
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
  return (
    <Box>
      <CreateLinkRecordModal
        state={state}
        types={types}
        records={records}
        handleChange={handleChange}
        open={open}
        setOpen={setOpen}
        productId={"627e8956-c130-4921-be19-364abe5d5bba"}
      ></CreateLinkRecordModal>
      {component}
    </Box>
  );
}
