import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function TiptapInputDialog({
  open,
  setOpen,

  addInput,
}) {
  const [inputId, setInputId] = React.useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleClick() {
    addInput(inputId);
  }

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter Id</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter an Id for the Input</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="input"
            label="Enter Input Id"
            fullWidth
            variant="standard"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClick}>Create</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
