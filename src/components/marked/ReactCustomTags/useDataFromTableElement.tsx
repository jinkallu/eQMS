import { useState, useEffect } from 'react';

const useDataFromTableElement = () => {
    /*
    fields = {value : Quantity, label : Quantity} etc.
    */
    const retrieveTableData = (table: HTMLTableElement, fields, conditions) => {
        //console.log(conditions);
        const keys = Object.keys(fields); // [value, label]
        let colFields = []
        for(let i = 0; i < keys.length; i++){
            const key = keys[i];
            colFields.push(fields[key]);
        }
        //console.log(keys);
        //console.log(colFields);

        const columnIndexes = getColumnIndexesByHeader(table, colFields);
        //console.log(columnIndexes);

        if (columnIndexes.length == 0) {
            return table;
        }

        const columnsData = {};
        const rows = table.querySelectorAll('tbody tr');



        for (let i = 0; i < columnIndexes.length; i++) {
            const columnName = colFields[i];
            const columnValues = [];
            const key = keys[i]; 

            rows.forEach((row) => {
                const cells = (row as HTMLTableRowElement).cells;
                if (cells.length > columnIndexes[i]) {
                    // Check conditions
                    const cellValue = cells[columnIndexes[i]].textContent.trim();
                    if(conditions == null){
                        conditions = [];
                    }
                    if (conditions.length > 0) {
                        if (conditions.every((condition) => evaluateCondition(condition, cells, table))) {
                            columnValues.push(cellValue);
                        }
                    }
                    else{
                        columnValues.push(cellValue);
                    }
                    //columnValues.push(cells[columnIndexes[i]].textContent.trim());
                }
            });
            columnsData[key] = columnValues;
        }
        //console.log(columnsData);

        return columnsData;
    }

    const evaluateCondition = (condition, rowData, table) => {
        if (condition.type === 'BinaryExpression') {
            //console.log(condition);
            const columnName = condition.leftNodeValue;
            const columnIndex = getColumnIndexeByHeader(table, columnName);
            if (columnIndex < 0) {
                console.log("Could not find column ", columnName);
                return false;
            }

            if (rowData.length <= columnIndex) {
                console.log("Wrong column index ", columnIndex);
                return false;
            }

            let leftValue;// = parseFloat(rowData[columnIndex]);
            let rightValue;// = condition.rightNodeValue;
            switch (condition.operator) {
                case '>':
                    leftValue = parseFloat(rowData[columnIndex].textContent.trim());
                    rightValue = parseFloat(condition.rightNodeValue);
                    return leftValue > rightValue;
                case '<':
                    leftValue = parseFloat(rowData[columnIndex].textContent.trim());
                    rightValue = parseFloat(condition.rightNodeValue);
                    return leftValue < rightValue;
                case '==': // Tricky, works for also float
                    leftValue = parseInt(rowData[columnIndex].textContent.trim());
                    rightValue = parseInt(condition.rightNodeValue);
                    return leftValue == rightValue; // loose equality
                case '===':
                    leftValue = rowData[columnIndex].textContent.trim();
                    rightValue = condition.rightNodeValue;
                    return leftValue === rightValue; // strict equality
                case '>=':
                    leftValue = parseFloat(rowData[columnIndex].textContent.trim());
                    rightValue = parseFloat(condition.rightNodeValue);
                    return leftValue >= rightValue;
                case '<=':
                    leftValue = parseFloat(rowData[columnIndex].textContent.trim());
                    rightValue = parseFloat(condition.rightNodeValue);
                    return leftValue <= rightValue;
                case '!=':
                    leftValue = parseInt(rowData[columnIndex].textContent.trim());
                    rightValue = parseInt(condition.rightNodeValue);
                    return leftValue != rightValue; // loose inequality
                case '!==':
                    leftValue = rowData[columnIndex].textContent.trim();
                    rightValue = condition.rightNodeValue;
                    return leftValue !== rightValue; // strict inequality
                // Add more operators as needed
                default:
                    return false;
            }

        }
        else if (condition.type === 'LogicalExpression') {
            const leftResult = evaluateCondition(condition.leftNodeValue, rowData, table);
            const rightResult = evaluateCondition(condition.rightNodeValue, rowData, table);

            //console.log(leftResult, rightResult);

            switch (condition.operator) {
                case '||':
                    return leftResult || rightResult;
                case '&&':
                    return leftResult && rightResult;
                // Add more logical operators as needed
                default:
                    return false;
            }
        }
        else {
            return false;
        }
    }

    // Function to get a column index by header name
    const getColumnIndexesByHeader = (table, fields) => {
        const indexes = [];

        for (let i = 0; i < fields.length; i++) {
            const index = getColumnIndexeByHeader(table, fields[i])
            if (index > -1) {
                indexes.push(index);
            }
        }
        return indexes;
    };

    // Function to get a column index by header name
    const getColumnIndexeByHeader = (table, field) => {
        const headerCells = table.querySelectorAll('thead th');
        for (let j = 0; j < headerCells.length; j++) {
            if (field.trim() === headerCells[j].textContent.trim()) {
                return j;
            }
        }
        return -1;
    };




    return { retrieveTableData };
}

export default useDataFromTableElement;