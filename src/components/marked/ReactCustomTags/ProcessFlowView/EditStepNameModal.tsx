import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Select,
  TextField,
  InputLabel,
  Box,
  Paper,
  Grid,
  Typography,
  Divider,
  Input,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { MarkerType } from "reactflow";

interface IConditions {
  operator: string;
  value: string;
  stepName: string;
  id: number;
}

interface IInputEl {
  id: string;
  name: string;
  selected: boolean;
  tagName: string;
}

import { useExtnStore } from "../../../../zustand/store";

export default function EditStepNameModal({
  open,
  setOpen,
  currentNode,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  currentNode: any;
}) {
  const [stepName, setStepName] = React.useState("");
  const { templateState, setTemplateState } = useExtnStore((state) => state);
  const [nameError, setNameError] = React.useState({
    error: false,
    message: "",
  });

  function handleClose() {
    setOpen(false);
  }

  function handleCreate() {
    const oldNodes = templateState["processFlow"]?.nodes || [];
    const oldEdges = templateState["processFlow"]?.edges || [];

    const nodeId = `${stepName}-step`;

    const stepWithSameName = oldNodes.filter(
      (item) =>
        item?.data?.label !== currentNode?.node?.data?.label &&
        item?.data?.label === stepName
    );

    if (stepWithSameName) {
      setNameError({ error: true, message: "Step with same name exists." });
    }
    setNameError({ error: false, message: "" });
    const newNodes = oldNodes?.map((item) => {
      if (item?.data?.label === currentNode?.node?.data?.label) {
        return {
          ...item,
          id: nodeId,
          data: { ...item?.data, label: stepName },
        };
      }
      return item;
    });

    const newEdges = oldEdges?.map((item) => {
      if (item?.source === currentNode?.node?.id) {
        return { ...item, source: nodeId, id: `${nodeId}_${item.target}` };
      }
      if (item?.target === currentNode?.node?.id) {
        return { ...item, target: nodeId, id: `${item.source}_${nodeId}` };
      }
      return item;
    });
    setTemplateState("processFlow", { nodes: newNodes, edges: newEdges });
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "800px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>
        {`Edit Step Name from ${currentNode?.node?.data?.label} `}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for the step...
        </DialogContentText>
        <TextField
          error={nameError?.error}
          autoFocus
          margin="dense"
          id="message"
          label="Step Name"
          helperText={nameError?.message}
          fullWidth
          variant="standard"
          value={stepName}
          onChange={(e) => setStepName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={!stepName || nameError?.error} onClick={handleCreate}>
          Save name
        </Button>
      </DialogActions>
    </Dialog>
  );
}
