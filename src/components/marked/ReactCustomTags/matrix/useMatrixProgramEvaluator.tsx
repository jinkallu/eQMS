import { useState, useEffect } from "react";
import * as acorn from "acorn";

import useDataFromTableElement from "../useDataFromTableElement";
import { useExtnStore } from "../../../../zustand/store";

type DataDataType = {
    rowdata: {
        value: [],
        label: [],
    },
    coldata: {
        value: [],
        label: [],
    },
    value: {
        value: [],
        label: [],
    },
    row: 0,
    column: 0
};

const useMatrixProgramEvaluator = (state) => {
    const [matrixData, setMatrixData] = useState({ rowdata: null, coldata: null, value: null })
    //const [rowdata, setRowdata] = useState(null);
    //const [coldata, setColdata] = useState(null);
    //const [value, setValue] = useState(null);


    const [dependStateIds, setDependStateIds] = useState([]);
    const { repository, getFileContent, userSOPs } = useExtnStore(
        (state) => state
    );
    const { retrieveTableData } = useDataFromTableElement();

    const initNull = () => {
        //dataSource = null;
        //selectSource = null;
        //whereSource = null;
    };

    async function getTemplateData(sopId, templateId) {
        const template = userSOPs
            ?.find((item) => item.branchId === sopId)
            ?.templates?.find((item) => item?.branchId === templateId);

        console.log("template", template);

        const data = await getFileContent(
            repository.id,
            template.filePath,
            template.name
        );
        //console.log("data is ", data);
        if (data) {
            const parser = new DOMParser();
            const html = parser.parseFromString(data, "text/html");
            return html;
        }
        return;
    }

    const evaluate = async (programString: string) => {
        initNull();
        const program = acorn.parse(programString, { ecmaVersion: 2020 });
        console.log(program);
        const result = await visitNodes(program);
        //console.log(dataSource, selectSource, whereSource);
        //const data = getData(dataSource, selectSource, whereSource);
        //console.log(data);

        //return data;
    };

    const visitNodes = async (nodes) => {
        const data = { rowdata: null, coldata: null, value: null }
        // pass 
        for (const node of nodes.body) {
            const result = await traverse(node, data);
            switch (result.leftNodeValue) {
                case "rowdata":
                    //setRowdata(result.rightNodeValue);
                    data.rowdata = result.rightNodeValue;
                    break;
                case "coldata":
                    //setColdata(result.rightNodeValue);
                    data.coldata = result.rightNodeValue;
                    break;
                case "value":
                    //setValue(result.rightNodeValue);
                    data.value = result.rightNodeValue;
                    break;
            }
        }
        console.log(data);

        setMatrixData(data);
    };

    const traverse = async (node, data) => {
        console.log(node.type);
        switch (node.type) {
            case "ExpressionStatement":
                return await visitExpressionStatement(node.expression, data);
            case "AssignmentExpression":
                return await visitAssignmentExpression(node, data);
            case "LogicalExpression":
                return await visitAssignmentExpression(node, data);
            case "BinaryExpression":
                return await visitBinaryExpression(node, data);
            case "Identifier":
                return node.name;
            case "Literal":
                return node.value;
            case "CallExpression":
                return await visitCallExpression(node, data);
            case "ObjectExpression":
                return await visitObjectExpression(node, data);
        }
    };

    function isObject(variable) {
        return typeof variable === 'object' && variable !== null && !Array.isArray(variable);
    }

    const visitExpressionStatement = async (node, data) => {
        const leftNode = await traverse(node.left, data);
        if (leftNode === "value" && data.rowdata.value.length > 0) {
            const rightNodeData = { value: new Array(data.rowdata.value.length), label: new Array(data.rowdata.value.length) };

            for (let i = 0; i < data.rowdata.value.length; i++) {
                rightNodeData.value[i] = new Array(data.coldata.value.length);
                rightNodeData.label[i] = [];


                for (let j = 0; j < data.coldata.value.length; j++) {
                    data.row = i;
                    data.column = j;

                    const rightNode = await traverse(node.right, data);
                    console.log(rightNode);
                    if(!isObject(rightNode)){
                        rightNodeData.value[i][j] = rightNode;
                    }
                    else{
                        rightNodeData.value[i][j] = rightNode.value[0];
                        rightNodeData.label[i].push(rightNode.label[0]);
                    }

                }
            }

            const operator = node.operator;
            const type = node.type;
            return {
                type: type,
                leftNodeValue: leftNode,
                operator: operator,
                rightNodeValue: rightNodeData,
            };
        }
        else{
            const rightNode = await traverse(node.right, data);
            const operator = node.operator;
            const type = node.type;
            return {
                type: type,
                leftNodeValue: leftNode,
                operator: operator,
                rightNodeValue: rightNode,
            };
        }
    }

    const visitObjectExpression = async (node, data) => {
        const object = {};
        for (const property of node.properties) {
            const key = await traverse(property.key, data);
            const value = await traverse(property.value, data);
            object[key] = value;
        }
        return object;
    }

    const visitAssignmentExpression = async (node, data) => {
        const leftNode = await traverse(node.left, data);
        const rightNode = await traverse(node.right, data);
        const operator = node.operator;
        const type = node.type;
        return {
            type: type,
            leftNodeValue: leftNode,
            operator: operator,
            rightNodeValue: rightNode,
        };
    };

    const visitBinaryExpression = async (node, data: DataDataType) => {
        const leftNode = await traverse(node.left, data);
        const rightNode = await traverse(node.right, data);
        const operator = node.operator;
        console.log(leftNode, rightNode, operator, data);
        switch (operator) {
            case "*":
                if (leftNode === "rowdata" && rightNode === "coldata") {
                    const vdata = data.rowdata.value[data.row] * data.coldata.value[data.column]
                    return vdata;
                }
                else {
                    return parseFloat(leftNode) * parseFloat(rightNode);
                }
            case "/":
                return parseFloat(leftNode) / parseFloat(rightNode);
            default:
                const type = node.type;
                return {
                    type: type,
                    leftNodeValue: leftNode,
                    operator: operator,
                    rightNodeValue: rightNode,
                };
        }
    };

    const visitCallExpression = async (node, data) => {
        const callee = await traverse(node.callee, data);

        switch (callee) {
            case "data":
                const fromArgs = [];
                for (const arg of node.arguments) {
                    const res = await traverse(arg, data);
                    fromArgs.push(res);
                }
                let datasource = {};
                for (const arg of fromArgs) {
                    datasource[arg.leftNodeValue] = arg.rightNodeValue;
                }

                console.log(datasource);

                return await getData(datasource);
                break;
        }
    };

    // get data fields from the given element
    const getData = async (datasource) => {
        console.log("datafrom", datasource);

        let selector = `#${datasource["from"]["id"]}`;
        //console.log(selector);

        const sopId = datasource["from"]["sopId"];
        const templateId = datasource["from"]["templateId"];
        console.log(sopId, templateId);
        let elements;
        if (sopId && templateId) {
            const html = await getTemplateData(sopId, templateId);
            elements = html.querySelectorAll(selector);
        }
        else { // The source is an independant source from the same file.
            console.log(selector);
            if (!dependStateIds.includes(datasource["from"]["id"])) {
                setDependStateIds(dependStatesIds => [...dependStatesIds, datasource["from"]["id"]]);
            }
            elements = document.querySelectorAll(selector);
        }

        if (elements.length === 0) {
            console.log("No element");
            return;
        }

        const tagName = elements[0].tagName;
        console.log(tagName);
        switch (tagName) {
            case "INPUT":
                console.log(elements[0].type);
                switch (elements[0].type.toUpperCase()) {
                    case "RADIO":
                        for (let i = 0; i < elements.length; i++) {
                            if (elements[i].checked) {
                                return elements[i].value;
                            }
                        }
                    default:
                        return elements[0].value;


                }
            case "TABLE":
                let conditions;
                if (datasource.hasOwnProperty("where")) {
                    if (datasource["where"].hasOwnProperty("condition")) {
                        conditions = [datasource["where"]["condition"]];
                    }
                    else {
                        conditions = [];
                    }
                }
                else {
                    conditions = [];
                }

                //console.log(datasource["where"]["condition"]);
                //conditions = [datasource["where"]["condition"]];
                return retrieveTableData(elements[0], datasource["select"], conditions);
            //break;
            case "SELECT":
                return elements[0].value;
            default:
                return state[datasource["from"]["id"]];
        }
    };

    return { dependStateIds, matrixData, evaluate };
};

export default useMatrixProgramEvaluator;
