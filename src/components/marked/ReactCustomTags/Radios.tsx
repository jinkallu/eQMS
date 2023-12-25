import { useEffect, useState } from "react";

interface RadiosProps {
    state: any;
    id: any;
    handleChange: any;
    options: any;
}

export default function Radios({state, id, handleChange, options}) {
    function handleChangeFun(e) {
        console.log(e);
        if (handleChange) {
            handleChange(id, {value: e.target.value, label: e.target.dataset.label});
        }
    }

    

    return (
        <>
            {options && options.value && Array.isArray(options.value) && options.value?.map((option, index) => (
                <label key={option}>
                    <input
                        type="radio"
                        value={option.textContent.trim()}
                        
                        onChange={(e) => {
                            e.nativeEvent.stopImmediatePropagation();
                            handleChangeFun(e);
                            // Additional logic if needed
                          }}
                        onInput={handleChangeFun}
                        checked = {index===0}
                        id={id}
                        data-label = {options.label?.[index].textContent.trim()} 
                    />
                    {options.label?.[index].textContent.trim()}
                </label>
            ))}
        </>
    )
}