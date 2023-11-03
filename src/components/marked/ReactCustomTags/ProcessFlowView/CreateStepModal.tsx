import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

import { useExtnStore } from "../../../../zustand/store";

export default function CreateStepModal({
  open,
  setOpen,
  stepName,
  setStepName,
  createStep,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  stepName: string;
  setStepName: (val: string) => void;
  createStep: () => void;
}) {
  const setAlertMessage = useExtnStore((state) => state.setAlertMessage);

  async function handleCreate() {
    createStep();
    setOpen(false);
  }

  function handleClose() {
    setOpen(false);
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Step</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for the step...
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="message"
          label="Message"
          fullWidth
          variant="standard"
          value={stepName}
          onChange={(e) => setStepName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={!stepName} onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
