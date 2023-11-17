import { useState, useEffect } from 'react';

const useDataFromTableElement = () => {
    const retrieveTableData = (table: HTMLTableElement, fields) => {
        
        const columnIndexes = getColumnIndexesByHeader(table, fields);
        console.log(columnIndexes);

        if(columnIndexes.length == 0){
            return table;
        }

        const columnsData = {};
        const rows = table.querySelectorAll('tbody tr');
        for(let i = 0; i < columnIndexes.length; i++){
            const columnValues = [];
            rows.forEach((row) => {
                const cells = (row as HTMLTableRowElement).cells;
                if (cells.length > columnIndexes[i]) {
                    columnValues.push(cells[columnIndexes[i]].textContent.trim());
                }
            }); 
            columnsData[fields[i]] = columnValues;
        }

        return columnsData;
    }

    // Function to get a column index by header name
    const getColumnIndexesByHeader = (table, fields) => {
        const indexes = [];
        const headerCells = table.querySelectorAll('thead th');

        for (let i = 0; i < fields.length; i++) {
            for( let j = 0; j < headerCells.length; j++){
                if (fields[i].trim() === headerCells[j].textContent.trim()) {
                    indexes.push(j);
                    break;
                }
            }
        }
        return indexes;
    };




    return { retrieveTableData };
}

export default useDataFromTableElement;