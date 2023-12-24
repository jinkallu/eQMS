import { useState, useEffect } from "react";
import * as acorn from "acorn";

import useDataFromTableElement from "./useDataFromTableElement";
import { useExtnStore } from "../../../zustand/store";

let dataSource = null;
let selectSource = null;
let whereSource = null;

const useProgramEvaluator = (state) => {
    const [options, setOptions] = useState(null);
    const [dependStateIds, setDependStateIds] = useState([]);
    const { repository, getFileContent, userSOPs } = useExtnStore(
        (state) => state
    );
    const { retrieveTableData } = useDataFromTableElement();

    const initNull = () => {
        dataSource = null;
        selectSource = null;
        whereSource = null;
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
        for (const node of nodes.body) {
            const result = await traverse(node);
            setOptions(result);
        }
    };

    const traverse = async (node) => {
        console.log(node.type);
        switch (node.type) {
            case "ExpressionStatement":
                return await traverse(node.expression);
            case "AssignmentExpression":
                return await visitAssignmentExpression(node);
            case "LogicalExpression":
                return await visitAssignmentExpression(node);
            case "BinaryExpression":
                return await visitBinaryExpression(node);
            case "Identifier":
                return node.name;
            case "Literal":
                return node.value;
            case "CallExpression":
                return await visitCallExpression(node);
            case "ObjectExpression":
                return await visitObjectExpression(node);
        }
    };

    const visitObjectExpression = async (node) => {
        const object = {};
        for (const property of node.properties) {
            const key = await traverse(property.key);
            const value = await traverse(property.value);
            object[key] = value;
        }
        return object;
    }

    const visitAssignmentExpression = async (node) => {
        const leftNode = await traverse(node.left);
        const rightNode = await traverse(node.right);
        const operator = node.operator;
        const type = node.type;
        return {
            type: type,
            leftNodeValue: leftNode,
            operator: operator,
            rightNodeValue: rightNode,
        };
    };

    const visitBinaryExpression = async (node) => {
        const leftNode = await traverse(node.left);
        const rightNode = await traverse(node.right);
        const operator = node.operator;
        console.log(leftNode, rightNode, operator);
        switch (operator) {
            case "*":
                return parseFloat(leftNode) * parseFloat(rightNode);
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

    const visitCallExpression = async (node) => {
        const callee = await traverse(node.callee);

        switch (callee) {
            case "data":
                const fromArgs = [];
                for (const arg of node.arguments) {
                    const res = await traverse(arg);
                    fromArgs.push(res);
                }
                let datasource = {};
                for (const arg of fromArgs) {
                    datasource[arg.leftNodeValue] = arg.rightNodeValue;
                }

                console.log(datasource);

                return await getData(datasource);
                //console.log(dataB);
                //dataSource = dataB;
                break;
            case "select":
                const selectArgs = [];
                for (const arg of node.arguments) {
                    const res = await traverse(arg);
                    selectArgs.push(res);
                }
                let sSource = {};
                for (const arg of selectArgs) {
                    sSource[arg.leftNodeValue] = arg.rightNodeValue;
                }
                console.log(sSource);
                selectSource = sSource;
                break;
            case "where":
                //let wSource = {};
                const whereArgs = [];
                for (const arg of node.arguments) {
                    const res = await traverse(arg);
                    whereArgs.push(res);
                }
                console.log(whereArgs);
                whereSource = whereArgs;
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
                console.log(elements[0].value);
                return elements[0].value;
            case "SPAN":
                console.log(elements[0])

                if(elements[0].dataset.type){
                    if(elements[0].dataset.type==="output"){
                        return elements[0].textContent;

                    }
                }
                
            default:
                return state[datasource["from"]["id"]];
        }
    };

    return { dependStateIds, options, evaluate };
};

export default useProgramEvaluator;
