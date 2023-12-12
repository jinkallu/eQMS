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
  let types = [];
  let records = [];
  try {
    const typesAttr = element.getAttribute("types");
    types = typesAttr ? JSON.parse(typesAttr) : [];
    const recAttr = element.getAttribute("records");
    records = recAttr ? JSON.parse(recAttr) : [];
  } catch (e) {}

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
      // let fieldNames = null;
      // if (types) {
      //   fieldNames = Object.keys(types);
      // }
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
      if (state) {
        if (state[id]) {
          console.log(state[id]);
          component = state[id]?.records?.map((item) => (
            <span key={item.recordId}>{item.recordName}</span>
          ));
        } else {
          component = <span>error</span>;
        }
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

  console.log(order, component);
  return (
    <Box>
      <CreateLinkRecordModal
        id={id}
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
