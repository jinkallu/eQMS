import { useState, useEffect } from 'react';
import * as acorn from 'acorn';

import useDataFromTableElement from './useDataFromTableElement';
import {useExtnStore} from "../../../zustand/store";

let dataSource;
let selectSource;
let whereSource;


const useProgramEvaluator = () => {

    const [options, setOptions] = useState(null);
    const { getEditBranch, repository, getFileContent } = useExtnStore((state) => state);
    const { retrieveTableData } = useDataFromTableElement();

    const initNull = () => {
        dataSource = null;
        selectSource = null;
        whereSource = null;
    }
    const evaluate = async (programString: string) => {
        initNull();
        const program = acorn.parse(programString, { ecmaVersion: 2020 });
        console.log(program);
        const result = await visitNodes(program);
        console.log(dataSource, selectSource, whereSource);
        const data = getData(dataSource, selectSource, whereSource);
        console.log(data);
        setOptions(data);
        //return data;
    }

    const visitNodes = async (nodes) => {
        for (const node of nodes.body) {
            const result = await traverse(node);
        }
    }

    const traverse = async (node) => {
        console.log(node.type);
        switch (node.type) {
            case 'ExpressionStatement':
                return await traverse(node.expression)
            case 'AssignmentExpression':
                return await visitAssignmentExpression(node);
            case 'LogicalExpression':
                return await visitAssignmentExpression(node);
            case 'BinaryExpression':
                return await visitAssignmentExpression(node);
            case 'Identifier':
                return node.name;
            case 'Literal':
                return node.value;
            case 'CallExpression':
                return await visitCallExpression(node);

        }
    }

    const visitAssignmentExpression = async (node) => {
        const leftNode = await traverse(node.left);
        const rightNode = await traverse(node.right);
        const operator = node.operator;
        const type = node.type;
        return { type: type, leftNodeValue: leftNode, operator: operator, rightNodeValue: rightNode }


        // switch(node.type){
        //     case 'CallExpression':
        //     default:
        //         const rightNode = traverse(node.right);
        //         return {leftNodeValue: leftNode, rightNodeValue: rightNode}
        // }

    }

    const visitCallExpression = async (node) => {
        const callee = await traverse(node.callee);

        switch (callee) {
            case "datafrom":
                const fromArgs = [];
                for (const arg of node.arguments) {
                    const res = await traverse(arg);
                    fromArgs.push(res);
                }
                let datasource = { tag: null, id: null };
                for (const arg of fromArgs) {
                    datasource[arg.leftNodeValue] = arg.rightNodeValue;
                }
                let selector = `${datasource.tag}#${datasource.id}`;

                console.log("datafrom", datasource);
                const branchName = "qms/temp/59b61741-abe4-464c-b3c9-00d58d0a37be/a613d234-3519-4422-96b8-469823744d6f/1_Risk_Management_Plan/main";
                const content = await getFileContent(
                    repository.id,
                    `/qms/temp/data.html`,
                    branchName
                  );

                //console.log(content);
                const parser = new DOMParser();
                const parsedDoc = parser.parseFromString(content, "text/html");
                
                const dataB = parsedDoc.querySelector(selector);
                //console.log(dataB);
                //setDatabaseS(dataB);
                dataSource = dataB;
                break;
            case "select":
                const selectArgs = [];
                for (const arg of node.arguments) {
                    const res = await traverse(arg);
                    selectArgs.push(res);
                }
                let sSource = [];
                for (const arg of selectArgs) {
                    sSource.push(arg);
                }
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
    }

    // get data fields from the given element
    const getData = (element, fields, conditions) => {
        if (!element) {
            console.log("No element")
            return;
        }

        const tagName = element.tagName;
        switch (tagName) {
            case "TABLE":
                return retrieveTableData(element, fields, conditions);
        }
    }

    return { options, evaluate }
}

export default useProgramEvaluator;