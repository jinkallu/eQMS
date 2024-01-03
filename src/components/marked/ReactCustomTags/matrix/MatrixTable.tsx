import { useEffect, useState } from "react";
import { useExtnStore } from "../../../../zustand/store";

interface MatrixTableProps {
  id: any;
  rowdata: any;
  coldata: any;
  value: any;
}

export default function MatrixTable({ id, rowdata, coldata, value }) {
  const { templateState, setTemplateState } = useExtnStore((state) => state);

  const [computedStyles, setComputedStyles] = useState(null);

  function handleChangeFun(e) {
    setTemplateState(id, e.target.value);
  }

  useEffect(() => {
    if (!value) {
      return;
    }
    const styles = new Array(rowdata.value.length);
    for (let i = 0; i < rowdata.value.length; i++) {
      styles[i] = new Array(coldata.value.length);
      for (let j = 0; j < coldata.label.length; j++) {
        const style = value?.label?.[i][j].getAttribute("style");
        styles[i][j] = style;
      }
    }
    console.log(styles);
    setComputedStyles(styles);
  }, [value]);

  function parseStyles(styleString) {
    const stylesArray = styleString.split(";").filter(Boolean);
    const stylesObject = {};

    stylesArray.forEach((style) => {
      const [property, value] = style.split(":").map((s) => s.trim());
      stylesObject[property] = value;
    });

    return stylesObject;
  }

  return (
    <table style={{ border: "1" }}>
      <tbody>
        {/* First row with row data */}
        <tr>
          <td></td> {/* Empty cell in the top-left corner */}
          {rowdata?.label.map((value, index) => (
            <td key={index}>{value.textContent.trim()}</td>
          ))}
        </tr>

        {/* Matrix data */}
        {coldata?.label.map((colValue, colIndex) => (
          <tr key={colIndex}>
            <td>{colValue.textContent.trim()}</td>{" "}
            {/* Column data in the first cell of each row */}
            {value &&
              computedStyles &&
              value.label[colIndex].length > 0 &&
              rowdata?.label.map((rowValue, rowIndex) => (
                <td
                  key={`${colIndex}-${rowIndex}`}
                  style={
                    computedStyles[rowIndex][colIndex]
                      ? parseStyles(computedStyles[rowIndex][colIndex])
                      : null
                  }
                >
                  {value?.label?.[rowIndex][colIndex].textContent.trim()}
                </td>
              ))}
            {value &&
              value.label[colIndex].length === 0 &&
              rowdata?.label.map((rowValue, rowIndex) => (
                <td key={`${colIndex}-${rowIndex}`}>
                  {value?.value?.[rowIndex][colIndex].textContent.trim()}
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
