import MoreVert from "@mui/icons-material/MoreVert";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { GridMoreVertIcon } from "@mui/x-data-grid";
import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { useExtnStore } from "../../../../zustand/store";
const dragHandleStyle = {
  display: "inline-block",
  width: 25,
  height: 25,
  backgroundColor: "teal",
  marginLeft: 5,
  borderRadius: "50%",
};
export default function StepNode({ data }) {
  const { userSOPs } = useExtnStore();
  const [templateId, setTemplateId] = React.useState(data.templateId);
  const [height, setHeight] = React.useState(data?.editable ? "100px" : "50px");

  React.useEffect(() => {
    setHeight(data?.editable ? "100px" : "50px");
  }, [data]);

  return (
    <Paper
      sx={{
        display: "flex",
        width: "200px",
        height: { height },
        overFlowY: "auto",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid blue",
          backgroundColor: "lightblue",
          alignItems: "center",
          width: "100%",
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
        {data?.editable && (
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel htmlFor="grouped-select">Select Template</InputLabel>
            <Select
              native
              id="grouped-s"
              value={templateId}
              onChange={() => {}}
            >
              <option aria-label="None" value="" />
              {userSOPs
                ?.filter((item) => item.templates?.length > 0)
                ?.map((sop) => (
                  <optgroup key={sop.relativePath} label={sop?.relativePath}>
                    {sop?.templates?.map((temp) => (
                      <option key={temp.branchId} value={temp.branchId}>
                        {temp?.relativePath}
                      </option>
                    ))}
                  </optgroup>
                ))}
            </Select>
          </FormControl>
        )}
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
        style={{ bottom: 0, background: "#555" }}
        isConnectable={true}
      />
      {/* <Handle
        type="source"
        position={Position.Right}
        id="source_right"
        style={{ top: 25, background: "#555" }}
        isConnectable={true}
      /> */}
    </Paper>
  );
}
