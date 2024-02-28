import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useCommit from "../../../CHooks/useCommit";
import { useExtnStore } from "../../../zustand/store"
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';


export default function TiptapImageOpenDialog({
  imageOpen,
  setImageOpen,

  insertImage,
}) {
  const [file, setFile] = React.useState(null);
  const { addBinaryFile } = useCommit();
  const { userSOPs, repository, project } = useExtnStore((state) => state);
  const [searchParams] = useSearchParams();

  //const [inputId, setInputId] = React.useState("");
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // function handleClick() {
  //   addInput(inputId);
  // }

  React.useEffect(() => {
    if (!project?.id || !repository?.id || !searchParams) {
      return;
    }



    //console.log(project?.id, repository?.id, filePath, editBranchName)
  }, [project, repository, searchParams])

  function handleChange(e) {
    console.log(e.target.files)
    if (e.target.files.length <= 0) {
      return;
    }
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        //const fileContent = event.target.result;
        try {
          if (typeof event.target.result === 'string') {
            const fileName = file.name;
            const fileExtension = fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);

            console.log(fileExtension);
            const base64String = event.target.result.split(',')[1]; // Extract base64 string from data URL
            const uuid = uuidv4();

            const filePath = `qms/sop/attachments/${uuid}.${fileExtension}`;
            const branchName = searchParams.get("branchName");
            let lastIndex = branchName.lastIndexOf("/main");

            // Replace the last occurrence with "/edit"
            let editBranchName =
              branchName.substring(0, lastIndex) +
              "/edit" +
              branchName.substring(lastIndex + "/main".length);


            addBinaryFile(project?.id, repository?.id, editBranchName, filePath, base64String, "adding image");
            insertImage(filePath)

          }
        }
        catch {

        }

      }
      reader.readAsDataURL(file);
    }
  }

  return (
    imageOpen && <input
      type="file"
      id="myfile"
      name="myfile"
      accept="image/*"
      onChange={handleChange}
    >

    </input>

    // <React.Fragment>
    //   <Dialog open={open} onClose={handleClose}>
    //     <DialogTitle>Enter Id</DialogTitle>
    //     <DialogContent>
    //       <DialogContentText>Enter an Id for the Input</DialogContentText>
    //       <TextField
    //         autoFocus
    //         required
    //         margin="dense"
    //         id="name"
    //         name="input"
    //         label="Enter Input Id"
    //         fullWidth
    //         variant="standard"
    //         value={inputId}
    //         onChange={(e) => setInputId(e.target.value)}
    //       />
    //     </DialogContent>
    //     <DialogActions>
    //       <Button onClick={handleClose}>Cancel</Button>
    //       <Button onClick={handleClick}>Create</Button>
    //     </DialogActions>
    //   </Dialog>
    // </React.Fragment>
  );
}
