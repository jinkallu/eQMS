import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

export default function EditConfModal({
  open,
  handleClose,
  commitMessage,
  setCommitMessage,
  saveContent,
}: {
  open: boolean;
  handleClose: () => void;
  commitMessage: string;
  setCommitMessage: (val: string) => void;
  saveContent: () => void;
}) {
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
        <Button disabled={!commitMessage} onClick={saveContent}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
