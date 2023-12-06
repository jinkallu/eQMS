import { useEffect, useState } from "react";

interface MatrixTableProps {
    state: any;
    id: any;
    handleChange: any;
    rowdata: any;
    coldata: any;
    value: any;
}

export default function MatrixTable({state, id, handleChange, rowdata, coldata, value}) {
    function handleChangeFun(e) {
        if (handleChange) {
            handleChange(id, e.target.value);
        }
    }

    return (
        <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
          <tbody>
            {/* First row with row data */}
            <tr>
              <td></td> {/* Empty cell in the top-left corner */}
              {rowdata?.label.map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
    
            {/* Matrix data */}
            {coldata?.label.map((colValue, colIndex) => (
              <tr key={colIndex}>
                <td>{colValue}</td> {/* Column data in the first cell of each row */}
                {rowdata?.label.map((rowValue, rowIndex) => (
                  <td key={`${colIndex}-${rowIndex}`}>{value?.[rowIndex][colIndex]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
}