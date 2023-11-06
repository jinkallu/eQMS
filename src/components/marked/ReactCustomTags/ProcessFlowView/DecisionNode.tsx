import React from "react";
import { Handle, Position } from "reactflow";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function DecisionNode({ data }) {
  return (
    <Box>
      <Box
        style={{
          width: "150px",
          height: "50px",
          display: "flex",
          flexDirection: "column",
          border: "1px solid blue",
          backgroundColor: "lightblue",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 10 }} variant="subtitle2">
          {data.label}
        </Typography>
      </Box>

      {/* <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="50,0 100,50 50,100 0,50"
          fill="lightblue"
          stroke="blue"
          strokeWidth="2"
        />
        <text x="10" y="60" fontSize="10" fill="black">
          {data.label}
        </text>
      </svg> */}
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        style={{ top: 0, background: "#555" }}
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
      <Handle
        type="source"
        position={Position.Left}
        id="source"
        style={{ top: 50, background: "#555" }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        style={{ bottom: 2, background: "#555" }}
        isConnectable={true}
      />
    </Box>
  );
}
