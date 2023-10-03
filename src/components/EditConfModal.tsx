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

import { useExtnStore } from "../zustand/store";

export default function EditConfModal({
  open,
  setOpen,
  loading,
  handleClose,
  commitMessage,
  setCommitMessage,
  saveContent,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  loading: boolean;
  handleClose: () => void;
  commitMessage: string;
  setCommitMessage: (val: string) => void;
  saveContent: () => Promise<boolean>;
}) {
  const setAlertMessage = useExtnStore((state) => state.setAlertMessage);

  async function handleSave() {
    const created = await saveContent();
    console.log(created);

    if (Boolean(created)) {
      setAlertMessage({
        message: "Data saved successfully",
        severity: "success",
      });
    } else {
      setAlertMessage({ message: "Unable to save data...", severity: "error" });
    }
    console.log(created);
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Save</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a save message so that you can identify it later...
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="message"
          label="Message"
          fullWidth
          variant="standard"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={!commitMessage || loading} onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
