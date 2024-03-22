import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Select,
  TextField,
  InputLabel,
  Box,
  Paper,
  Grid,
  Typography,
  Divider,
  Input,
  Chip,
  Stack,
} from "@mui/material";

import { useExtnStore } from "../../../../zustand/store";

export default function CreateLinkRecordModal({
  id,
  open,
  setOpen,
  types,
  productId,
  records,
}: {
  id: string;
  open: boolean;
  setOpen: (val: boolean) => void;
  types: any;
  records: any;
  productId?: string;
}) {
  console.log(records);
  const {
    userSOPs,
    setAlertMessage,
    repository,
    refreshProductRecords,
    templateState,
    setTemplateState,
  } = useExtnStore((state) => state);
  const [selectedSOP, setSelectedSOP] = useState(
    (types && types[0]?.sopId) || null
  );
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [recordsList, setRecordsList] = useState([]);

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState([]);
  useEffect(() => {
    if (records && records?.length > 0) setSelectedRecords(records);
  }, [records]);

  async function handleCreate() {
    setTemplateState(id, selectedRecords);
    setOpen(false);
  }

  async function getRecords() {
    if (!repository || !productId) {
      return;
    }
    const data = await refreshProductRecords(repository.id, productId);
    if (data) {
      console.log(data);
      setRecordsList(data);
    }
  }
  function handleClose() {
    setOpen(false);
  }

  function handleRecordChange(event) {
    const {
      target: { value },
    } = event;

    const vals = typeof value === "string" ? value.split(",") : value;
    setSelectedRecord(
      // On autofill we get a stringified value.
      vals
    );

    setSelectedRecords((prev) => {
      let newRec = [];
      vals?.map((selected) => {
        const rec = prev?.find((record) => record?.recordId === selected);
        if (!rec) {
          const recordName = recordsList?.find(
            (item) => item?.branchId === selected
          )?.relativePath;
          newRec.push({ recordId: selected, recordName });
        }
      });
      return [...prev, ...newRec];
    });
  }
  function handleDelete(recordId) {
    setSelectedRecords((prev) =>
      prev?.filter((item) => item.recordId !== recordId)
    );
  }
  useEffect(() => {
    getRecords();
  }, [productId, repository]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add/Edit Linked Records</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "24px",
              margin: "9px",
            }}
          >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="select">Select SOP</InputLabel>
              <Select
                id="select"
                value={selectedSOP}
                onChange={(e) => setSelectedSOP(e.target.value)}
              >
                {userSOPs
                  ?.filter((sop) =>
                    types?.map((item) => item?.sopId)?.includes(sop.branchId)
                  )
                  ?.map((sop) => (
                    <option value={sop?.branchId}> {sop?.relativePath}</option>
                  ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="select">Select Template</InputLabel>
              <Select
                id="selectTemp"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                {userSOPs
                  ?.find((sop) => sop.branchId === selectedSOP)
                  ?.templates?.filter((temp) =>
                    types
                      ?.find((item) => item.sopId === selectedSOP)
                      ?.templateIds?.includes(temp.branchId)
                  )
                  ?.map((temp) => (
                    <option value={temp?.branchId}>{temp?.relativePath}</option>
                  ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="select">Select Record/s</InputLabel>
              <Select
                id="selectRec"
                multiple
                native
                value={selectedRecord}
                onChange={handleRecordChange}
              >
                {recordsList
                  ?.filter(
                    (rec) =>
                      rec.sopId === selectedSOP &&
                      rec.templateId === selectedTemplate
                  )
                  ?.map((record) => (
                    <option value={record?.branchId}>
                      {record?.relativePath}
                    </option>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <DialogContentText>Selected Records</DialogContentText>
          <Stack direction="row" spacing={1}>
            {selectedRecords?.map((rec) => (
              <Chip
                label={rec.recordName}
                onDelete={() => handleDelete(rec.recordId)}
              />
            ))}
          </Stack>
        </Box>

        <Divider></Divider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
