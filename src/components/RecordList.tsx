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
import RecordViewModal from "./RecordViewModal";

const RecordEle = ({
  record,
  step,
  level,
  setParentId,
  productId,
  setCurrentTemplateId,
  setStepSelector,
  setOpenCreateRecordModal,
  productRecords,
  activeLevel,
  isIncrement,
  setMaxLevel,
}) => {
  const [expand, setExpand] = React.useState(false);
  const [currentRecordId, setCurrentRecordId] = React.useState("");
  const [openViewRecordModal, setOpenViewRecordModal] = React.useState(false);
  const [showChildrenIcon, setShowChildrenicon] = React.useState(false);

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

  React.useEffect(() => {
    const productLevelStep = step?.children?.find(
      (item) => item?.data?.productLevel
    );
    console.log("productLevelStep", productLevelStep);

    if (productLevelStep) {
      setShowChildrenicon(
        productRecords?.filter(
          (rec) => rec.templateId === productLevelStep?.templateId
        )?.length > 0
      );
    } else {
      setShowChildrenicon(
        productRecords?.filter((rec) => rec.parentId === record.branchId)
          ?.length > 0
      );
    }
  }, [record]);
  React.useEffect(() => {
    if (isIncrement) {
      if (level < activeLevel) setExpand(true);
    } else {
      if (level >= activeLevel) setExpand(false);
    }
  }, [level, activeLevel, isIncrement]);

  React.useEffect(() => {
    setMaxLevel((prev) => {
      if (prev === level && showChildrenIcon) {
        return prev + 1;
        // return prev + 1;
      } else {
        return prev;
      }
    });
  }, [level, showChildrenIcon]);

  return (
    <div
      style={{
        fontSize: "13px",
        color: "000000E6",
        paddingTop: "5px",
        paddingBottom: "5px",
      }}
    >
      <RecordViewModal
        open={openViewRecordModal}
        setOpen={setOpenViewRecordModal}
        record={record}
        productId={productId}
      ></RecordViewModal>

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
        <Grid item xs={3}>
          <Grid container direction="row" alignItems="center" spacing={2}>
            <Grid item xs={1}></Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
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
            <Grid item xs={7}>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
              onClick={() => setOpenViewRecordModal(true)}
            >
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
      </Grid>
      {expand &&
        // record.branchId === currentRecordId &&
        step?.children?.map(
          (stepChild) =>
            stepChild?.records?.length > 0 &&
            stepChild?.records
              ?.filter((rec) =>
                stepChild?.data?.productLevel
                  ? stepChild?.templateId === rec?.templateId
                  : rec.parentId === record.branchId
              )
              ?.map((rec) => (
                <RecordEle
                  key={rec?.branchId}
                  step={stepChild}
                  record={rec}
                  productId={productId}
                  level={level + 1}
                  setParentId={setParentId}
                  setCurrentTemplateId={setCurrentTemplateId}
                  setStepSelector={setStepSelector}
                  setOpenCreateRecordModal={setOpenCreateRecordModal}
                  productRecords={productRecords}
                  activeLevel={activeLevel}
                  isIncrement={isIncrement}
                  setMaxLevel={setMaxLevel}
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
  setCurrentRecordforView,
}) {
  const { refreshProductRecords, repository } = useExtnStore();
  const [productRecords, setProductRecords] = React.useState([]);

  const [stepTree, setSetTree] = React.useState([]);
  const [activeLevel, setActivelevel] = React.useState(0);
  const [maxLevel, setMaxLevel] = React.useState(0);

  const [isIncrement, setIsIncrement] = React.useState(null);

  async function getRecords(productId) {
    const data = await refreshProductRecords(repository.id, productId);
    console.log(data);
    setProductRecords(data);
  }
  React.useEffect(() => {
    getRecords(productId);
  }, [productId, refreshReqd]);

  React.useEffect(() => {
    console.log(processFlowTree);
    const stepTreeData = getStepsTreeWithRecords(processFlowTree?.steps);
    console.log(stepTreeData);

    setSetTree(stepTreeData);
  }, [productRecords, processFlowTree]);

  function handleActiveLevelAddClick() {
    if (activeLevel < maxLevel) {
      setActivelevel((prev) => prev + 1);
    }
    setIsIncrement(true);
  }
  function handleActiveLevelMinusClick() {
    if (activeLevel === 0) {
      return;
    }
    setActivelevel((prev) => prev - 1);

    setIsIncrement(false);
  }

  function getStepsTreeWithRecords(steps) {
    return steps?.map((step, index) => {
      let records;
      if (step?.type === "multidec") {
        records = productRecords?.filter(
          (product) =>
            product?.templateId === "1" && product?.title === step?.data?.label
        );
      } else {
        records = productRecords?.filter(
          (product) => product?.templateId === step?.templateId
        );
      }

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
        minWidth: "70vw",
        maxHeight: "70vh",
        overflow: "auto",
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
          <Grid item xs={3}>
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
              <Grid item xs={1}></Grid>
              <Grid item xs={7}>
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
        </Grid>
      </div>
      {stepTree?.length > 0 &&
        stepTree[0]?.records &&
        stepTree[0]?.records?.map((record) => (
          <RecordEle
            key={record?.branchId}
            step={stepTree[0]}
            record={record}
            productId={productId}
            level={0}
            setParentId={setParentId}
            setCurrentTemplateId={setCurrentTemplateId}
            setStepSelector={setStepSelector}
            setOpenCreateRecordModal={setOpenCreateRecordModal}
            productRecords={productRecords}
            activeLevel={activeLevel}
            isIncrement={isIncrement}
            setMaxLevel={setMaxLevel}
          />
        ))}
    </Paper>
  );
}
