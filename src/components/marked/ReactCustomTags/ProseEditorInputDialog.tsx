import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ProsEditorInputDialog({
  open,
  setOpen,
  setIdEle,
  insertInputFieldDialog,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  function handleSubmit(e) {
    insertInputFieldDialog("Testinput");
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        // PaperProps={{
        //   component: "form",
        //   onSubmit: (event) => {
        //     event.preventDefault();
        //     const formData = new FormData(event.currentTarget);
        //     const formJson = Object.fromEntries(formData.entries());
        //     const email = formJson.email;
        //     console.log(email);
        //     handleClose();
        //   },
        // }}
      >
        <DialogTitle>Enter Id</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a unique Id for the input element..
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="id"
            name="email"
            label="Id"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
