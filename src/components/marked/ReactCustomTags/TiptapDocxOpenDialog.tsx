import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useCommit from "../../../CHooks/useCommit";
import { useExtnStore } from "../../../zustand/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Box, Paper } from "@mui/material";
import useFetchBranchFileContent from "../../../CHooks/buffer/useFetchBranchFileContent";
import { arrayBufferToBase64 } from "../../../utils/conversionHelpers.js";
import { getEditBranchName } from "../../../utils/gitHelpers.js";
import { useDocxToHTML } from "./useDocxToHTML";

const ImageItem = ({
  item,

  projectId,
  repositoryId,
  editBranchName,
  insertImage,
}) => {
  const { fileContent, fetchBranchFile } = useFetchBranchFileContent();

  React.useEffect(() => {
    if (item && projectId && repositoryId && editBranchName) {
      const type = editBranchName.split("/")[1];
      const filePath = `qms/${type}/attachments/${item.relativePath}`;

      fetchBranchFile(projectId, repositoryId, filePath, editBranchName);
    }
  }, [item]);

  function handleClick() {
    const type = editBranchName.split("/")[1];
    const filePath = `qms/${type}/attachments/${item.relativePath}`;
    insertImage(filePath);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "grey",
        },
      }}
      onClick={handleClick}
    >
      <Paper elevation={3}>
        <h4>{item.relativePath}</h4>
        <img
          src={`data:image/png;base64,${arrayBufferToBase64(fileContent)}`}
          alt="Lamp"
          width="100"
          height="100"
        />
      </Paper>
    </Box>
  );
};

export default function TiptapDocxOpenDialog({
  docxOpen,
  setDocxOpen,
  insertDocx,
}) {
  const [file, setFile] = React.useState(null);
  const { addBinaryFile } = useCommit();
  const { userSOPs, repository, project, getFilesOfFolder } = useExtnStore(
    (state) => state
  );
  const [imageItems, setImageItems] = React.useState([]);
  const [searchParams] = useSearchParams();
  const branchNameMain = searchParams.get("branchName");
  const [fileNameError, setFileNameError] = React.useState("");
  const { htmlDoc, handleDocXChange, setHtmlDoc } = useDocxToHTML();

  //const [inputId, setInputId] = React.useState("");
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setDocxOpen(false);
  };

  React.useEffect(() => {
    if (htmlDoc) {
      insertDocx(htmlDoc);
      setHtmlDoc(null);
    }
  }, [htmlDoc]);

  async function handleChange(e) {
    console.log(e.target.files);
    if (e.target.files.length <= 0) {
      return;
    }
    handleDocXChange(e);
    handleClose();

    //const file = e.target.files[0];

    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = function (event) {
    //     //const fileContent = event.target.result;
    //     try {
    //       //if (typeof event.target.result === "string") {
    //         //const fileName = file.name;

    //         // if (
    //         //   imageItems?.filter((item) => item.relativePath === fileName)
    //         //     ?.length > 0
    //         // ) {
    //         //   setFileNameError("File name already exists..");
    //         //   return;
    //         // }

    //         // const fileExtension = fileName.slice(
    //         //   ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
    //         // );

    //         //const base64String = event.target.result.split(",")[1]; // Extract base64 string from data URL
    //         // const uuid = uuidv4();

    //         // const filePath = `qms/sop/attachments/${uuid}.${fileExtension}`;
    //         //const filePath = `qms/sop/attachments/${fileName}`;
    //         //const branchName = searchParams.get("branchName");
    //         //let lastIndex = branchName.lastIndexOf("/main");

    //         // Replace the last occurrence with "/edit"
    //         // let editBranchName =
    //         //   branchName.substring(0, lastIndex) +
    //         //   "/edit" +
    //         //   branchName.substring(lastIndex + "/main".length);

    //         // add logic to convert docx
    //         handleClose();
    //         insertDocx();
    //       //}
    //     } catch {}
    //   };
    //   reader.readAsDataURL(file);
    // }
  }

  return (
    docxOpen && (
      <React.Fragment>
        <Dialog
          open={docxOpen}
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
          <DialogTitle>Image Selection</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Upload a file or choose from below
            </DialogContentText>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
              }}
            >
              <input
                type="file"
                id="myfile"
                name="myfile"
                // accept="image/*"
                onChange={handleChange}
              ></input>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {/* <Button onClick={handleClick}>Create</Button> */}
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  );
}
