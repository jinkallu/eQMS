import {
  Paper,
  Box,
  Button,
  Modal,
  CircularProgress,
  Toolbar,
} from "@mui/material";
import React from "react";
import { useExtnStore } from "../zustand/store";
import TiptapEditor from "./marked/ReactCustomTags/TiptapEditor";

export default function RecordViewModal({
  open,
  setOpen,
  productId,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  productId?: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const { repository, getFileContent, currentRecord, setCurrentRecord } =
    useExtnStore();

  const [md, setMd] = React.useState("");

  async function getFileData(repositoryId, path, branchName) {
    setLoading(true);

    const data = await getFileContent(repositoryId, path, branchName);

    setMd(data);
    setLoading(false);
  }

  React.useEffect(() => {
    if (repository.id && currentRecord && open) {
      const nameArray = currentRecord.name.split("/");
      const path = [nameArray[0], nameArray[1], "data.html"]?.join("/");

      getFileData(repository.id, path, currentRecord?.name);
    }
  }, [repository, currentRecord, open]);

  function handleCancel() {
    setOpen(false);
    setCurrentRecord(null);
    setMd(null);
  }

  // const md = "# Hello give here proper md from the template! <input>";
  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          paddingX: "24px",
          height: "100%",
        }}
      >
        <Toolbar />
        <button onClick={() => setOpen(false)}>Close</button>
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "36px",
            flexDirection: "column",
            gap: "12px",
            overflowY: "auto",
          }}
        >
          {loading && <CircularProgress></CircularProgress>}
          {md && <TiptapEditor editMode={false} content={md}></TiptapEditor>}
          <Box>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
}
