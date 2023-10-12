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
import NoteAltIcon from "@mui/icons-material/NoteAlt";

import { useExtnStore } from "../zustand/store";
import Tooltip from "@mui/material/Tooltip";

const RecordEle = ({
  record,
  step,
  level,
  setParentId,
  setCurrentTemplateId,
  setStepSelector,
  setOpenCreateRecordModal,
  productRecords,
  activeLevel,
  isIncrement,
}) => {
  const [expand, setExpand] = React.useState(false);
  const [currentRecordId, setCurrentRecordId] = React.useState("");

  function handleExpandClick(recordId) {
    setCurrentRecordId(recordId);
    setExpand((prev) => !prev);
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

  const showChildrenIcon =
    step?.children
      ?.map((item) => item?.records?.length)
      ?.filter((item) => item > 0)?.length > 0;

  React.useEffect(() => {
    if (isIncrement) {
      if (level <= activeLevel) setExpand(true);
    } else {
      if (level > activeLevel) setExpand(false);
    }
  }, [level, activeLevel, isIncrement]);

  return (
    <div
      style={{
        fontSize: "13px",
        color: "000000E6",
        paddingTop: "5px",
        paddingBottom: "5px",
      }}
    >
      <Grid
        container
        spacing={2}
        direction="row"
        alignItems="center"
        sx={{
          "&:hover": {
            backgroundColor: "#e3dfde",
          },
        }}
      >
        <Grid item xs={2}>
          <Grid container direction="row" alignItems="center" spacing={2}>
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
            <Grid item xs={1}></Grid>
            <Grid item xs={8}>
              <span>{step?.name}</span>
            </Grid>
            <Grid item xs={1}>
              {showChildrenIcon && (
                <IconButton
                  size="small"
                  onClick={() => handleExpandClick(record?.branchId)}
                >
                  {!expand ? (
                    <KeyboardArrowRightIcon
                      height={24}
                      width={24}
                      fontSize="small"
                    ></KeyboardArrowRightIcon>
                  ) : (
                    <ExpandMoreIcon
                      height={24}
                      width={24}
                      fontSize="small"
                    ></ExpandMoreIcon>
                  )}
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: `${level * 15}px`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <NoteAltIcon
                height={24}
                width={24}
                fontSize="small"
                color="primary"
              ></NoteAltIcon>

              <span>{record?.title}</span>
            </div>
          </div>
        </Grid>
        <Grid item xs={1}>
          {record?.commit?.author?.date?.toDateString()}
        </Grid>
        <Grid item xs={1}>
          {record?.commit?.committer?.date?.toDateString()}
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      {expand &&
        // record.branchId === currentRecordId &&
        step?.children?.map(
          (stepChild) =>
            stepChild?.records?.length > 0 &&
            stepChild?.records
              ?.filter((rec) => rec.parentId === record.branchId)
              ?.map((rec) => (
                <RecordEle
                  key={rec?.branchId}
                  step={stepChild}
                  record={rec}
                  level={level + 1}
                  setParentId={setParentId}
                  setCurrentTemplateId={setCurrentTemplateId}
                  setStepSelector={setStepSelector}
                  setOpenCreateRecordModal={setOpenCreateRecordModal}
                  productRecords={productRecords}
                  activeLevel={activeLevel}
                  isIncrement={isIncrement}
                ></RecordEle>
              ))
        )}
    </div>
  );
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
  const [activeLevel, setActivelevel] = React.useState(-1);

  const [isIncrement, setIsIncrement] = React.useState(null);

  async function getRecords(productId) {
    const data = await refreshProductRecords(repository.id, productId);
    setProductRecords(data);
  }
  React.useEffect(() => {
    getRecords(productId);
  }, [productId, refreshReqd]);

  React.useEffect(() => {
    const stepTreeData = getStepsTreeWithRecords(processFlowTree?.steps);

    setSetTree(stepTreeData);
  }, [productRecords, processFlowTree]);

  function handleActiveLevelAddClick() {
    setActivelevel((prev) => prev + 1);
    setIsIncrement(true);
  }
  function handleActiveLevelMinusClick() {
    if (activeLevel <= -1) {
      return;
    }
    setActivelevel((prev) => prev - 1);
    setIsIncrement(false);
  }

  function handleLevelClick(val) {}

  function getStepsTreeWithRecords(steps) {
    return steps?.map((step, index) => {
      const records = productRecords?.filter(
        (product) => product?.templateId === step?.templateId
      );

      const canExpand = step?.children?.length > 0;

      if (step?.children) {
        return {
          ...step,
          records,
          canExpand,
          level: index,
          children: getStepsTreeWithRecords(step?.children),
        };
        // return { ...step, records, canExpand, level: index, children };
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
        minWidth: "1300px",
        height: "80vh",
      }}
    >
      {/* <Fab size="small" color="primary" onClick={handleNewCreate}>
        <AddIcon></AddIcon>
      </Fab> */}
      <Button size="small" color="primary" onClick={handleNewCreate}>
        Create New
      </Button>
      <div>
        <Grid container spacing={2} direction="row" alignItems="center">
          <Grid item xs={2}>
            <Grid container direction="row" alignItems="center" spacing={2}>
              <Grid item xs={1}>
                <Tooltip title="Expand one level">
                  <IconButton
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "20px",
                      width: "20px",
                      border: "1px solid black",
                      margin: "2px",
                    }}
                    onClick={handleActiveLevelAddClick}
                  >
                    <AddIcon fontSize="small"></AddIcon>
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={1}>
                <Tooltip title="Collapse one level">
                  <IconButton
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "20px",
                      width: "20px",
                      border: "1px solid black",
                      margin: "2px",
                    }}
                    onClick={handleActiveLevelMinusClick}
                  >
                    <RemoveIcon fontSize="small"></RemoveIcon>
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={8}>
                <span style={{ color: "#0000008C", fontSize: "12px" }}>
                  Action
                </span>
              </Grid>
              <Grid item xs={1}></Grid>
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
          <Grid item xs={1}></Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </div>
      {stepTree?.length > 0 &&
        stepTree[0]?.records &&
        stepTree[0]?.records?.map((record) => (
          <RecordEle
            key={record?.branchId}
            step={stepTree[0]}
            record={record}
            level={0}
            setParentId={setParentId}
            setCurrentTemplateId={setCurrentTemplateId}
            setStepSelector={setStepSelector}
            setOpenCreateRecordModal={setOpenCreateRecordModal}
            productRecords={productRecords}
            activeLevel={activeLevel}
            isIncrement={isIncrement}
          />
        ))}
    </Paper>
  );
}
