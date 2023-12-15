import { useEffect, useState } from "react";

interface DisplayTableProps {
    state: any;
    id: any;
    handleChange: any;
    options: any;
}

export default function DisplayTable({state, id, handleChange, options}) {
    function handleChangeFun(e) {
        if (handleChange) {
            handleChange(id, e.target.value);
        }
    }

    if(options){
        if(!options.value[0]){
            return;
        }
        state[id] = options.value[0].textContent.trim();
    }

    return (
            <table style={{ border: '1' }}>
                <thead>
                    <tr>
                        {options && Object.keys(options)?.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {options?.label?.map((label, index) => (
                        <tr key={index}>
                            <td>{label.textContent.trim()}</td>
                            <td>{options?.value[index]?.textContent.trim()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    )
}