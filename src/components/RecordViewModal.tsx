import { Paper, Box, Button, Modal, CircularProgress } from "@mui/material";
import React from "react";
import { useExtnStore } from "../zustand/store";

export default function RecordViewModal({
  open,
  setOpen,
  record,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  record: any;
}) {
  const [loading, setLoading] = React.useState(false);
  const { repository, getFileContent } = useExtnStore();

  const [md, setMd] = React.useState("");

  async function getFileData(repositoryId, path, branchName) {
    setLoading(true);

    const data = await getFileContent(repositoryId, path, branchName);
    setMd(data);
    setLoading(false);
  }

  React.useEffect(() => {
    if (repository.id && record) {
      const nameArray = record.name.split("/");
      const path = [nameArray[0], nameArray[1], "data.html"]?.join("/");

      getFileData(repository.id, path, record?.name);
    }
  }, [repository, record, open]);

  function handleCancel() {
    setOpen(false);
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
          padding: "24px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "36px",
            flexDirection: "column",
            gap: "12px",
            height: "100%",
          }}
        >
          {loading && <CircularProgress></CircularProgress>}
          <h3>{md}</h3>
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
