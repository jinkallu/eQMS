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
            handleChange(id, {value: e.target.value, label: e.target.dataset.label});
        }
    }

    if(options){
        if(!options.value[0]){
            return;
        }
        //document.getElementById(id).dispatchEvent()
        state[id] = {value: options?.value[0]?.textContent.trim(), label: options?.label[0]?.textContent.trim()};
        //state[id]['label'] = options?.label[0]?.textContent.trim();
        //handleChange(id, {value: options?.value[0]?.textContent.trim(), label: options?.label[0]?.textContent.trim()});
    }

    return (
        <>
            {options && options.value?.map((option, index) => (
                <label key={option}>
                    <input
                        type="radio"
                        value={option.textContent.trim()}
                        
                        onChange={handleChangeFun}
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