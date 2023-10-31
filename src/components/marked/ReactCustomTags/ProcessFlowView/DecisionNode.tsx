import React from "react";
import { Handle, Position } from "reactflow";

export default function DecisionNode({ data}) {
    return (
        <div>
            <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,0 100,50 50,100 0,50" fill="lightblue" stroke="blue" strokeWidth="2" />
                <text x="10" y="60" fontSize="10" fill="black">{data.label}</text>
            </svg>
            <Handle
                type="target"
                position={Position.Left}
                id="target"
                style={{ top: 50, background: "#555" }}
                onConnect={(params) => console.log("handle onConnect", params)}
                isConnectable={true}
            />
            {/* <div>{data.label}</div> */}
            <Handle
                type="source"
                position={Position.Right}
                id="source"
                style={{ top: 50, background: "#555" }}
                isConnectable={true}
            />
        </div>
    );
}