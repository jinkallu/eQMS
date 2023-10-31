import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export default function TemplateNode({ data }) {
    const width = 150;
    const height = 60;
    return (
        <div>
            <svg width={width} height={height * 2} xmlns="http://www.w3.org/2000/svg">
                <path
                    fill="#cef"
                    stroke="#838383"
                    d={`M0 0h${width}v${height}c-${width / 2} -${height / 2} -${width / 2} ${height / 2} -${width} 0z`}
                />
                <text x="10" y="20" fontSize="10" fill="black">{data.label}</text>
            </svg>
            {/* <Handle
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
                id="source"
                style={{ bottom: 50, background: "#555" }}
                isConnectable={true}
            /> */}
            <Handle
                type="target"
                position={Position.Left}
                id="target"
                style={{ top: 25, background: "#555" }}
                isConnectable={true}
            />
        </div>
    );
}