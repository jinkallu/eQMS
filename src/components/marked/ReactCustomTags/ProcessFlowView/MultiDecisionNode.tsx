import React from "react";
import { Handle, Position } from "reactflow";

export default function MultiDecisionNode({ data }) {
    //const d = ["yes", "no", "unknown"];
    const textStyle = {
        fill: "white", // Text color
    };

    return (
        <>
            {/* <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,0 100,50 50,100 0,50" fill="lightblue" stroke="blue" strokeWidth="2" />
                <text x="10" y="60" fontSize="10" fill="black">{data.label}</text>
            </svg> */}
            <svg width="200" height={(data.conditions.length + 2) * 30}>
                <rect x="0" y="0" width="100%" height="100%" fill="lightblue" />
                <text x="10" y={(20)} style={textStyle}>{data.label}</text>
                <text x="10" y={(50)} style={textStyle}>{data.field}</text>
                {data.conditions.map((value, index) => (
                    <text key={index} x="10" y={((index + 2) * 30 + 20)}>{value}</text>
                ))}
            </svg>

            <Handle
                type="target"
                position={Position.Top}
                id="target"
                style={{ top: 0, background: "#555" }}
                onConnect={(params) => console.log("handle onConnect", params)}
                isConnectable={true}
            />

            {data.conditions.map((value, index) => (
                <Handle
                    type="source"
                    position={index % 2 === 0 ? Position.Left : Position.Right}
                    id={value}
                    style={{ top: (index + 2) * 30 + 20, background: "#555" }}
                    isConnectable={true}
                />
            ))}

            {/* <div>{data.label}</div> */}
            {/* <Handle
                type="source"
                position={Position.Right}
                id="source"
                style={{ top: 50, background: "#555" }}
                isConnectable={true}
            />
            <Handle
                type="source"
                position={Position.Left}
                id="source"
                style={{ top: 50, background: "#555" }}
                isConnectable={true}
            /> */}
            {/* <Handle
                type="source"
                position={Position.Bottom}
                id="source"
                style={{ bottom: 2, background: "#555" }}
                isConnectable={true}
            /> */}
        </>
    );
}