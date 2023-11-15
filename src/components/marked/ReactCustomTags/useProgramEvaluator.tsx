import { useState } from 'react';
import * as acorn from 'acorn';



const useProgramEvaluator = () => {

    const [databaseS, setDatabaseS] = useState(null);

    const evaluate = (programString:string) => {
        const program = acorn.parse(programString, { ecmaVersion: 2020 });
        console.log(program);
        const result = visitNodes(program);
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
                const dataB = document.querySelector(selector)
                //setDatabaseS(dataB);
                break;
            case "select":
                let selectsource = {};
                for (const arg of args){
                    selectsource[arg.leftNodeValue] = arg.rightNodeValue;
                }
                console.log(selectsource);
                break;
            case "where":
                let wheresource = {};
                for (const arg of args){
                    wheresource[arg.leftNodeValue] = arg.rightNodeValue;
                }
                console.log(wheresource);
                break;
        }
    }

    return {evaluate}
}

export default useProgramEvaluator;