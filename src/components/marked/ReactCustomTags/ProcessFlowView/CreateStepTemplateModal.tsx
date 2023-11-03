import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  ListSubheader,
  MenuItem,
} from "@mui/material";

import { useExtnStore } from "../../../../zustand/store";

export default function CreateStepTemplateModal({
  open,
  setOpen,
  currentNode,
  setNodes,
  setEdges,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  currentNode: any;
  setNodes: (val: any) => void;
  setEdges: (val: any) => void;
}) {
  const { setAlertMessage, userSOPs } = useExtnStore((state) => state);
  const [template, setTemplate] = React.useState<string>();

  async function handleCreate() {
    addTemplate();
    setOpen(false);
  }

  function handleClose() {
    setOpen(false);
  }

  const addTemplate = () => {
    const position = {
      x: currentNode.node.position.x + 200,
      y: currentNode.node.position.y,
    };

    let templateName;

    userSOPs?.map((sop) => {
      const templateNameData = sop?.templates?.find(
        (item) => item.branchId === template
      )?.relativePath;
      if (templateNameData) {
        templateName = templateNameData;
      }
      return sop;
    });

    if (!templateName) {
      // show some error here
      return;
    }

    const data = {
      label: templateName,
      type: "template",
    };

    const newNode = {
      ...currentNode.node,
      id: `${template}-template`,
      position,
      data,
      type: "template",
    };

    setNodes((nodes) => {
      return [...nodes, newNode];
    });

    const newEdge = {
      id: currentNode.node.id + "_" + newNode.id,
      source: currentNode.node.id,
      target: newNode.id,
      sourceHandle: "source_right",
      targetHandle: "target",
    };

    setEdges((edges) => {
      return [...edges, newEdge];
    });

    //fitView();
  };

  function handleChange(e) {
    setTemplate(e.target.value);
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Step</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for the step...
        </DialogContentText>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel htmlFor="grouped-select">Select Template</InputLabel>
          <Select
            native
            defaultValue=""
            id="grouped-s"
            value={template}
            onChange={handleChange}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={!template} onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
