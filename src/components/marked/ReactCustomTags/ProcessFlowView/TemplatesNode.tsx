import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export default function TemplatesNode({ data }) {
    const width = 150;
    const height = 60;

    const generatePaths = (count) => {
        const paths = [];
        for (let i = 0; i < count; i++) {
          const width_i = width + i * 2; // Adjust the width as needed
          const height_i = height + i;   // Adjust the height as needed
      
          paths.push(
            <path
              key={i}
              d={`M${i * 2 + 1.5} ${i * 2 + 13.5}h${width_i}v${height_i * 0.538}c${-width_i / 2} ${-height_i / 2} ${-width_i / 2} ${height_i / 2}-${width_i} 0z`}
              fill="#cef"
            />
          );
        }
        return paths;
      };
      
    return (
        <div>
            <svg width={width} height={height * 2} xmlns="http://www.w3.org/2000/svg">
            {generatePaths(3)}
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