import { Paper, Box, Button, Modal, CircularProgress } from "@mui/material";
import React from "react";
import { useExtnStore } from "../zustand/store";
import MarkedToCustom from "./marked/MarkedToCustom";

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

  const [md, setMd] = React.useState<HTMLElement>(null);

  async function getFileData(repositoryId, path, branchName) {
    console.log(repositoryId, path, branchName);
    setLoading(true);

    const data = await getFileContent(repositoryId, path, branchName);
    const html = await new DOMParser()?.parseFromString(data, "text/html");
    console.log(html);
    setMd(html?.body);
    setLoading(false);
  }

  React.useEffect(() => {
    console.log("current Record", currentRecord);
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
          padding: "24px",
          minHeight: "70vh",
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
            overflowY: "auto",
          }}
        >
          <button onClick={() => setOpen(false)}>Close</button>
          {loading && <CircularProgress></CircularProgress>}
          {md && (
            <MarkedToCustom
              element={md}
              open={null}
              setOpen={null}
              order="last"
              productId={productId}
            ></MarkedToCustom>
          )}
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
