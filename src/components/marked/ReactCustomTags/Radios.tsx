import { useEffect, useState } from "react";

interface RadiosProps {
    state: any;
    id: any;
    handleChange: any;
    options: any;
}

export default function Radios({state, id, handleChange, options}) {
    function handleChangeFun(e) {
        if (handleChange) {
            handleChange(id, e.target.value);
        }
    }

    if(options){
        state[id] = options.value[0];
    }

    return (
        <>
            {options && options.value?.map((option, index) => (
                <label key={option}>
                    <input
                        type="radio"
                        value={option}
                        checked = {index===0}
                        onChange={handleChangeFun}
                        id={id}
                    />
                    {options.label?.[index]}
                </label>
            ))}
        </>
    )
}