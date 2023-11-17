import { useState, useEffect } from 'react';
import * as acorn from 'acorn';

import useDataFromTableElement from './useDataFromTableElement';

let dataSource;
let selectSource;
let whereSource;


const useProgramEvaluator = () => {

    const [databaseS, setDatabaseS] = useState(null);

    const {retrieveTableData} = useDataFromTableElement();

    const initNull = () => {
        dataSource = null;
        selectSource = null;
        whereSource = null;
    }


    const evaluate = (programString:string) => {
        initNull();
        const program = acorn.parse(programString, { ecmaVersion: 2020 });
        console.log(program);
        const result = visitNodes(program);
        console.log(dataSource, selectSource, whereSource);
        const data = getData(dataSource, selectSource);
        console.log(data);
        return data;
    }

    const visitNodes = (nodes) => {
        for (const node of nodes.body) {
            const result = traverse(node);
        }
    }

    const traverse = (node) => {
        console.log(node.type);
        switch (node.type){
            case 'ExpressionStatement':
                return traverse(node.expression)
            case 'AssignmentExpression':
                return visitAssignmentExpression(node)
            case 'Identifier':
                return node.name;
                case 'Literal':
                return node.value;
            case 'CallExpression':
                return visitCallExpression(node);

        }
    }

    const visitAssignmentExpression = (node) => {
        const leftNode = traverse(node.left);
        const rightNode = traverse(node.right);
        return {leftNodeValue: leftNode, rightNodeValue: rightNode}
    
        
        // switch(node.type){
        //     case 'CallExpression':
        //     default:
        //         const rightNode = traverse(node.right);
        //         return {leftNodeValue: leftNode, rightNodeValue: rightNode}
        // }

    }

    const visitCallExpression = (node) => {
        const callee = traverse(node.callee);
        const args = [];
        for(const arg of node.arguments){
            const res = traverse(arg);
            args.push(res);
        }
        switch(callee){
            case "datafrom":
                let datasource = {tag: null, id: null};
                for (const arg of args){
                    datasource[arg.leftNodeValue] = arg.rightNodeValue;
                }
                let selector = `${datasource.tag}#${datasource.id}`;

                console.log("datafrom", datasource);
                const dataB = document.querySelector(selector);
                console.log(dataB);
                //setDatabaseS(dataB);
                dataSource = dataB;
                break;
            case "select":
                let sSource = [];
                for (const arg of args){
                    //console.log(arg);
                    //switch (arg.type){
                    //    case "Identifier":
                            sSource.push(arg);
                    //    break;
                    //}
                    //sSource[arg.leftNodeValue] = arg.rightNodeValue;
                }
                console.log(sSource);
                selectSource = sSource; 
                break;
            case "where":
                let wSource = {};
                for (const arg of args){
                    //wSource[arg.leftNodeValue] = arg.rightNodeValue;
                }
                console.log(wSource);
                whereSource = wSource;
                break;
        }
    }

    // get data fields from the given element
    const getData = (element, fields) => {
        if(!element){
            console.log("No element")
            return;
        }

        const tagName = element.tagName;
        switch(tagName){
            case "TABLE":
                return retrieveTableData(element, fields);
        }
    } 

    return {evaluate}
}

export default useProgramEvaluator;