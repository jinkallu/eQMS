import MoreVert from "@mui/icons-material/MoreVert";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import { GridMoreVertIcon } from "@mui/x-data-grid";
import React, { memo } from "react";
import { Handle, Position } from "reactflow";
const dragHandleStyle = {
  display: "inline-block",
  width: 25,
  height: 25,
  backgroundColor: "teal",
  marginLeft: 5,
  borderRadius: "50%",
};
export default function StepNode({ data }) {
  return (
    <Paper sx={{ display: "flex" }}>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography sx={{ fontSize: 10 }} variant="subtitle2">
            {data.label}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "start" }}>
          <Typography sx={{ fontSize: 10 }} variant="subtitle2">
            {data?.templateName}
          </Typography>
        </Box>
      </Box>

      {/* <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,0 100,0 100,50, 0,50" fill="lightblue" stroke="blue" strokeWidth="2" />
                <text x="10" y="20" fontSize="10" fill="black">{data.label}</text>
            </svg>  */}
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
        style={{ top: 25, background: "#555" }}
        isConnectable={true}
      />
    </Paper>
  );
}
