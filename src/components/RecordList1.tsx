import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RemoveIcon from "@mui/icons-material/Remove";
import Fab from "@mui/material/Fab";
import { v4 as uuidv4 } from "uuid";

import { useExtnStore } from "../zustand/store";

const RecordEle = ({
  step,
  parentId,
  level,
  setParentId,
  setCurrentTemplateId,
  setStepSelector,
  setOpenCreateRecordModal,
  productRecords,
  activeLevel,
}) => {
  const [expand, setExpand] = React.useState(false);
  const [currentRecordId, setCurrentRecordId] = React.useState("");

  function handleExpandClick(recordId) {
    setCurrentRecordId(recordId);
    setExpand((prev) => !prev);
  }
  const records = productRecords?.filter(
    (product) =>
      product?.templateId === step?.templateId && product?.parentId === parentId
  );
  if (records?.length === 0) {
    return <h2>No records found.. create new..</h2>;
  }

  function handleStepOneClick(parentId, templateId) {
    setParentId(parentId);
    setCurrentTemplateId(templateId);
    setStepSelector([]);
    setOpenCreateRecordModal(true);
  }

  function handleCreateFromRecordClick(parentId, steps) {
    setParentId(parentId);
    setStepSelector(steps);

    setOpenCreateRecordModal(true);
  }

  // React.useEffect(() => {
  //   if (level === activeLevel) setExpand(true);
  // }, [level, activeLevel]);

  return records?.map((record) => (
    <div
      style={{
        fontSize: "13px",
        color: "000000E6",
        paddingTop: "5px",
        paddingBottom: "5px",
      }}
      key={`${record?.branchId}`}
    >
      <Grid container spacing={2} direction="row" alignItems="center">
        <Grid item xs={5}>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={1}>
              {step?.children?.length > 0 && (
                <IconButton
                  size="small"
                  onClick={() =>
                    handleCreateFromRecordClick(record.branchId, step?.children)
                  }
                >
                  <AddIcon fontSize="small"></AddIcon>
                </IconButton>
              )}
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={9}>
              <span style={{ paddingLeft: `${level * 10}px` }}>
                {step?.name}
              </span>
            </Grid>
            <Grid item xs={1}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {step?.children?.length > 0 && (
                  <IconButton
                    size="small"
                    onClick={() => handleExpandClick(record?.branchId)}
                  >
                    {!expand ? (
                      <KeyboardArrowRightIcon fontSize="small"></KeyboardArrowRightIcon>
                    ) : (
                      <ExpandMoreIcon fontSize="small"></ExpandMoreIcon>
                    )}
                  </IconButton>
                )}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ paddingLeft: `${level * 10}px` }}>
              {record?.title}
            </span>
          </div>
        </Grid>
        <Grid item xs={1}>
          {record?.commit?.author?.date?.toDateString()}
        </Grid>
        <Grid item xs={1}>
          {record?.commit?.committer?.date?.toDateString()}
        </Grid>
      </Grid>
      {expand &&
        record?.branchId === currentRecordId &&
        step?.children?.map(
          (item) =>
            item?.records?.length > 0 &&
            item?.records?.map((record) => (
              <RecordEle
                key={record.branchId}
                step={item}
                parentId={record.branchId}
                level={level + 1}
                setParentId={setParentId}
                setCurrentTemplateId={setCurrentTemplateId}
                setStepSelector={setStepSelector}
                setOpenCreateRecordModal={setOpenCreateRecordModal}
                productRecords={productRecords}
                activeLevel={activeLevel}
              ></RecordEle>
            ))
        )}
    </div>
  ));
};

export default function RecordList({
  productId,
  refreshReqd,
  processFlowTree,
  setParentId,
  setCurrentTemplateId,
  setOpenCreateRecordModal,
  setStepSelector,
  handleNewCreate,
}) {
  const { refreshProductRecords, repository } = useExtnStore();
  const [productRecords, setProductRecords] = React.useState([]);
  const [stepTree, setSetTree] = React.useState([]);
  const [activeLevel, setActivelevel] = React.useState(0);

  async function getRecords(productId) {
    const data = await refreshProductRecords(repository.id, productId);
    console.log(data);
    setProductRecords(data);
  }
  React.useEffect(() => {
    getRecords(productId);
  }, [productId, refreshReqd]);

  React.useEffect(() => {
    console.log(productRecords, processFlowTree);
    console.log(getStepsTree(processFlowTree?.steps));
    const stepTreeData = getStepsTreeWithRecords(processFlowTree?.steps);
    console.log(stepTreeData);

    setSetTree(stepTreeData);
  }, [productRecords, processFlowTree]);

  function getStepsTree(steps, parentTemplateId = 0) {
    let obj = [];
    steps?.forEach((step) => {
      const records = productRecords?.filter(
        (product) => product?.templateId === step?.templateId
      );
      obj = [
        ...obj,
        {
          ...step,
          parentTemplateId: parentTemplateId,
          records,
        },
      ];
      if (step?.children) {
        obj = [...obj, ...getStepsTree(step?.children, step?.templateId)];
      }
    });
    return obj;
  }

  function getStepsTreeWithRecords(steps, parentTemplateId = 0) {
    return steps?.map((step, index) => {
      const records = productRecords?.filter(
        (product) => product?.templateId === step?.templateId
      );

      const canExpand = step?.children?.length > 0;

      if (step?.children) {
        getStepsTreeWithRecords(step?.children, step?.templateId);
      }

      return { ...step, records, canExpand, level: index };
    });
  }

  return (
    <Paper
      sx={{
        paddingX: "32px",
        paddingY: "9px",
        flexGrow: 1,
      }}
    >
      <Button variant="contained" size="small" onClick={handleNewCreate}>
        Create New
      </Button>
      <div>
        <Grid container spacing={2} direction="row" alignItems="center">
          <Grid item xs={5}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={1}>
                <IconButton
                  size="small"
                  onClick={() => setActivelevel((prev) => prev + 1)}
                >
                  <AddIcon fontSize="small"></AddIcon>
                </IconButton>
              </Grid>
              <Grid item xs={1}>
                <IconButton size="small">
                  <RemoveIcon fontSize="small"></RemoveIcon>
                </IconButton>
              </Grid>
              <Grid item xs={10}>
                <span style={{ color: "#0000008C", fontSize: "12px" }}>
                  Action
                </span>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <span style={{ color: "#0000008C", fontSize: "12px" }}>
              Document
            </span>
          </Grid>
          <Grid item xs={1}>
            <span style={{ color: "#0000008C", fontSize: "12px" }}>
              Created on
            </span>
          </Grid>
          <Grid item xs={1}>
            <span style={{ color: "#0000008C", fontSize: "12px" }}>
              Modified on
            </span>
          </Grid>
        </Grid>
      </div>
      {stepTree?.length > 0 &&
        stepTree[0]?.records?.length > 0 &&
        stepTree[0]?.records?.map((record) => (
          <RecordEle
            key={record.branchId}
            step={stepTree[0]}
            parentId={"0"}
            level={0}
            setParentId={setParentId}
            setCurrentTemplateId={setCurrentTemplateId}
            setStepSelector={setStepSelector}
            setOpenCreateRecordModal={setOpenCreateRecordModal}
            productRecords={productRecords}
            activeLevel={activeLevel}
          />
        ))}
    </Paper>
  );
}
