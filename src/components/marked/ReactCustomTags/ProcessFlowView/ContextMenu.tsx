import React, { useCallback, useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';

export default function ContextMenu({ id, top, left, right, bottom, myNodes, setMyNodes, myEdges, setMyEdges, ...props }) {
    const { getNode, getNodes, addNodes, addEdges, setEdges, getEdges, fitView } = useReactFlow();
    const [nextStep, setNextStep] = useState({ hasNextStep: true, hasTemplate: true });

    const duplicateNode = useCallback(() => {
        const node = getNode(id);
        const position = {
            x: node.position.x + 50,
            y: node.position.y + 50,
        };
        //const newNodes = ;
        //console.log(newNodes);
        addNodes({ ...node, id: `${node.id}-copy`, position });
        //console.log(getNode(`${node.id}-step`))
    }, [id, getNode, addNodes]);

    

    const deleteNode = useCallback(() => {
        //setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id));
    }, [id, setEdges]);

    const addNextStep = useCallback(() => {
        const node = getNode(id);
        const position = {
            x: node.position.x,
            y: node.position.y + 200,
        };

        const data = {
            label: "New Step",
            type: "step"
        }

        //const parentExtent = getNode("A").extent;

        const newNode = { ...node,
            id: `${node.id}-step`, 
            position: position, 
            data: data,
            //parentNode: "A",
            //extent: 'parent'
        };
        console.log(node, newNode)
        //addNodes(newNode);
        console.log(myNodes);
        const myNewNodes = [...myNodes];
        myNewNodes.push(newNode);
        const processflowId = "A";

        const foundElement = myNewNodes.find((element) => element.id === processflowId);
        if(foundElement){
            foundElement.style.height = position.y + 300;
        }
        setMyNodes(myNewNodes);

        const newEdge = { 
            id: id + "_" + newNode.id, 
            source: id, 
            target: newNode.id,
            sourceHandle : "source_bottom",
            targetHandle : "target", 
        };
        
        const myNewEdges = [...myEdges];
        myNewEdges.push(newEdge);
        setMyEdges(myNewEdges);

        //console.log(getNode(`${node.id}-step`))

        //fitView();
    }, [id, getNode, addNodes, addEdges, fitView, setEdges, myEdges, setMyEdges, myNodes, setMyNodes]);

    const addTemplate = useCallback(() => {
        const node = getNode(id);
        const position = {
            x: node.position.x + 200,
            y: node.position.y,
        };

        const data = {
            label: "New Template",
            type: "template"
        }

        const newNode = { 
            ...node, 
            id: `${node.id}-template`, 
            position, 
            data,
            type: "template"
        };
        ///addNodes(newNodes);
        //myNodes.push(newNode);
        //setMyNodes(myNodes);
        const myNewNodes = [...myNodes];
        myNewNodes.push(newNode);
        setMyNodes(myNewNodes);

        const newEdge = { 
            id: id + "_" + newNode.id, 
            source: id, 
            target: newNode.id,
            sourceHandle : "source_right",
            targetHandle : "target",
        };
        const myNewEdges = [...myEdges];
        myNewEdges.push(newEdge);
        setMyEdges(myNewEdges);
        //addEdges(newEdge)

        //fitView();
    }, [id, getNode, addNodes, addEdges, fitView, myNodes, setMyNodes]);

    useEffect(() => {
        const node = getNode(id);
        if (node.data.type === "template") {
            setNextStep({ hasNextStep: true, hasTemplate: true });
        }
        else if (node.data.type === "step") {
            const edges = getEdges();
            const connectedChildren = edges.filter((edge) => edge.source == id);
            const stepData = { hasNextStep: false, hasTemplate: false };
            connectedChildren.forEach(child => {
                const targetNode = getNode(child.target);
                if (targetNode.data.type === "step") {
                    stepData.hasNextStep = true;
                }
                else if (targetNode.data.type === "template") {
                    stepData.hasTemplate = true;
                }

            });
            setNextStep(stepData);
        }
        //console.log(stepData);
    }, [id]);

    return (
        <div style={{ top, left, right, bottom }} className="context-menu" {...props}>
            <p style={{ margin: '0.5em' }}>
                <small>node: {id}</small>
            </p>
            {!nextStep.hasNextStep && <button onClick={addNextStep}>Next Step</button>}
            {!nextStep.hasTemplate && <button onClick={addTemplate}>Add Template</button>}
            <button onClick={duplicateNode}>duplicate</button>
            <button onClick={deleteNode}>delete</button>
        </div>
    );
}
