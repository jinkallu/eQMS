import React,  { memo }from "react";
import { Handle, Position } from "reactflow";

export default function StepNode({ data}) {
    return (
        <div>
             <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,0 100,0 100,50, 0,50" fill="lightblue" stroke="blue" strokeWidth="2" />
                <text x="10" y="20" fontSize="10" fill="black">{data.label}</text>
            </svg> 
            <Handle
                type="target"
                position={Position.Top}
                id="target"
                style={{ background: "#555" }}
                onConnect={(params) => console.log("handle onConnect", params)}
                isConnectable={true}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="source_bottom"
                style={{ bottom: 50, background: "#555" }}
                isConnectable={true}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="source_right"
                style={{  top:25, background: "#555" }}
                isConnectable={true}
            />
        </div>
    );
}