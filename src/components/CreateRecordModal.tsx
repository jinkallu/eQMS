import {
  Paper,
  TextField,
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Chip,
  Dialog,
  Modal,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  ListItemText,
  OutlinedInput,
  Checkbox,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { useExtnStore } from "../zustand/store";
import { createPR } from "../utils/gitHelpers.js";
//import Editor from "./marked/Editor";
//import useMarkdToHTML from "./marked/useMarkdToHTML";
import RecordView from "./Pages/RecordView";
import MarkedToCustom from "./marked/MarkedToCustom";
import { ConstructionOutlined } from "@mui/icons-material";
import useCreateBranch from "../CHooks/useCreateBranch";
import { v4 as uuidv4 } from "uuid";

export default function CreateRecordModal({
  open,
  setOpen,
  parentId,
  step,
  process,

  handleCreate,
  currentTemplateId,
  stepSelector,
  setCurrentTemplateId,
  productId,
}) {
  const [title, setTitle] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const {
    getFileContent,
    branchTypes,
    repository,
    refreshProductRecords,
    templateState,
    setTemplateState,
    project,
  } = useExtnStore();
  // const [state, setState] = React.useState<{ key: string; value: any }>(null);
  const [approverList, setApproverList] =
    React.useState<{ uniqueName: string; url: string; selected: boolean }[]>();

  const [md, setMd] = React.useState<HTMLElement>(null);
  const [html, setHtml] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [currentStep, setCurrentStep] = React.useState(null);
  const { createBranch } = useCreateBranch();

  const [selectedApprovers, setSeletedApprovers] = React.useState([]);

  // const rev

  async function getFileData(repositoryId, path, branchName) {
    const dataRes = await getFileContent(repositoryId, path, branchName);
    setData(dataRes);

    const parser = new DOMParser();
    const htmlData = parser.parseFromString(dataRes, "text/html");
    setHtml(htmlData);
    const grouping = stepSelector?.find(
      (item) => item.templateId === currentTemplateId
    )?.data?.grouping;
    // let els;

    let searchQueryArray = [];
    grouping?.map((item) => {
      searchQueryArray.push(`GROUPING[name][name="${item}"]`);
    });

    const searchString = searchQueryArray.join(",");

    // const els = html.querySelectorAll('GROUPING[name][name="Customer Basic"]');
    if (searchString) {
      const els = htmlData.querySelectorAll(searchString);
      if (!els) {
        return;
      }

      // const els = html.getElementsByTagName("SECTION");

      const newDiv = document.createElement("div");

      Array.from(els)?.map((item: Node) => {
        newDiv.appendChild(item);
        return item;
      });
      setMd(newDiv);
    }
    // const els = html.querySelectorAll(grouping);
    else {
      setMd(htmlData?.body);
    }
  }

  async function handleCreateMultiDecBranch({
    title,
    uniqueId,

    templateId,
    process,
    productId,
  }) {
    // check for duplicate name or number

    const newTitle = title.replace(/ /g, "_");

    // create unique id for the sop branch name
    const branchName = `qms/rec/${productId}/${process.sop.branchId}/${templateId}/${parentId}/${uniqueId}/${newTitle}/main`;
    const res = await createBranch(
      project.id,
      repository.id,
      "main",
      branchName
    );

    return res;

    // // create path for the sop like sop/management/
    // let newPath = newTitle;
    // // if (number) {
    // //   newPath = number + "-" + newPath;
    // //   newPath = "sop" + "-" + newPath;
    // // }
    // newPath = "qms/rec/data.html";

    // // rename the current readme.md so that the folder structure created..

    // const renameRes = await renameFile(
    //   project.id,
    //   repository.id,
    //   branchName,
    //   "/README.md",
    //   newPath,
    //   "rename default README.md file"
    // );
    // if (renameRes) {
    //   setBranches(repository.id);
    // }

    // setOpenCreateRecordModal(false);

    // if (renameRes) {
    //   const res = await commit(
    //     project.id,
    //     repository.id,
    //     branchName,
    //     newPath,
    //     content,
    //     "Record initial creation"
    //   );
    //   setAlertMessage({ message: "Document Created...", severity: "success" });
    //   setRefreshReqd((prev) => !prev);
    // } else {
    //   setAlertMessage({
    //     message: "Document Creation not successfull...",
    //     severity: "error",
    //   });
    // }
  }

  async function getData(repositoryId, productId, parentId, step) {
    const productRecords = await refreshProductRecords(repositoryId, productId);

    const parentRecord = productRecords?.find(
      (item) => item?.branchId === parentId && item?.productId === productId
    );
    console.log(productRecords, parentRecord);
    if (parentRecord) {
      const dataRes = await getFileContent(
        repositoryId,
        parentRecord?.path,
        parentRecord?.name
      );

      if (dataRes) {
        const html = new DOMParser().parseFromString(dataRes, "text/html");
        if (step?.data?.inputEl?.id) {
          const ele = html?.getElementById(step?.data?.inputEl?.id);
          if (ele) {
            const value = ele?.getAttribute("value");
            // todo for including other operators also
            const condition = step?.data?.conditions?.find(
              (item) => value === item.value
            );
            if (condition) {
              const currentStepData = step?.children?.find(
                (item) => item?.data?.label === condition?.stepName
              );
              if (currentStepData) {
                setCurrentStep(currentStepData);
                setCurrentTemplateId(currentStepData?.templateId);
              }
            }
          }
        }
      }
    }
  }

  React.useEffect(() => {
    console.log(parentId, productId, repository?.id, step);
    if (parentId && productId && repository?.id && step?.type === "multidec") {
      getData(repository?.id, productId, parentId, step);
    }
  }, [parentId, productId, repository, step]);

  React.useEffect(() => {
    if (!currentTemplateId || !repository?.id || !open) return;

    const branch = branchTypes["temp"]?.find(
      (item) => item.branchId === currentTemplateId
    );
    if (branch) {
      getFileData(repository.id, branch?.filePath, branch?.name);
    }
  }, [currentTemplateId, repository, branchTypes, open]);

  React.useEffect(() => {
    if (stepSelector?.length > 0) {
      setCurrentTemplateId(stepSelector[0]?.templateId || "");
    }
  }, [stepSelector]);

  function handleCancel() {
    setTitle("");
    setOpen(false);
    // navigate("/qmshub.html/");
  }
  const handleChange = (id, value) => {
    setTemplateState(id, value);
    // setState((values) => ({ ...values, [id]: value }));
  };

  function handleSelectChange(e) {
    console.log(stepSelector);
    const templateId = stepSelector?.find(
      (item) => item.templateId === e.target.value
    )?.templateId;

    setCurrentTemplateId(templateId);
  }

  async function handleClick() {
    const html = new DOMParser().parseFromString(data, "text/html");
    console.log(templateState);

    templateState &&
      Object.keys(templateState)?.map((key) => {
        const ele = html?.querySelector(`#${key}`);
        const value = templateState[key];

        if (ele) {
          if (ele.tagName === "INPUT") {
            ele.setAttribute("value", value);
          } else if (ele.tagName === "MD") {
            // ele.innerHTML = value;
          } else if (ele.tagName === "LINKRECORD") {
            ele.setAttribute("records", JSON.stringify(value));
          }
          // else if (ele.tagName === "PROCESSFLOW") {
          //   const edges = state["processFlow"]?.edges || [];
          //   const nodes = state["processFlow"]?.nodes || [];

          //   ele.dataset.nodes = JSON.stringify(nodes);
          //   ele.dataset.edges = JSON.stringify(edges);
          // }
          else {
            ele.setAttribute("value", JSON.stringify(value));
          }
        }
      });

    // Object.entries(templateState)?.map(([key, value]) => {
    //   const ele = html?.querySelector(`#${key}`);

    //   if (ele) {
    //     if (ele.tagName === "INPUT") {
    //       ele.setAttribute("value", value);
    //     } else if (ele.tagName === "MD") {
    //       // ele.innerHTML = value;
    //     } else if (ele.tagName === "LINKRECORD") {
    //       ele.setAttribute("records", JSON.stringify(value));
    //     }
    //     // else if (ele.tagName === "PROCESSFLOW") {
    //     //   const edges = state["processFlow"]?.edges || [];
    //     //   const nodes = state["processFlow"]?.nodes || [];

    //     //   ele.dataset.nodes = JSON.stringify(nodes);
    //     //   ele.dataset.edges = JSON.stringify(edges);
    //     // }
    //     else {
    //       ele.setAttribute("value", JSON.stringify(value));
    //     }
    //   }
    // });

    // Object.keys(state)?.map((key) => {
    //   const ele = html.querySelector(`#${key}`);

    //   if (ele) ele.setAttribute("value", state[key] || "");
    // });

    const uniqueId = uuidv4();

    const res = await handleCreateMultiDecBranch({
      title: step?.data?.label,
      uniqueId,

      templateId: "1",
      process,
      productId,
    });

    if (res) {
      handleCreate(title, html?.body?.innerHTML, uniqueId);
    }

    setTitle("");
  }
  // const md = "# Hello give here proper md from the template! <input>";
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "800px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>
        Create Record
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Chip label={step?.name} color="primary"></Chip>
        </Box>
      </DialogTitle>
      <DialogContent>
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
            <Typography
              variant="h6"
              sx={{
                alignSelf: "flex-start",
                paddingBottom: "24px",
                paddingTop: "12px",
              }}
            >
              Create new
            </Typography>
            {step?.type !== "multidec" && stepSelector?.length > 0 && (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select Template
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentTemplateId}
                  label="template"
                  onChange={handleSelectChange}
                >
                  {stepSelector?.map((item) => (
                    <MenuItem
                      key={item.name + item.templateId}
                      value={item.templateId}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {step?.type === "multidec" && <h5>{currentStep?.templateName} </h5>}
            <FormControl sx={{ m: 1, width: 300 }}>
              <TextField
                helperText="Enter the record name"
                id="number"
                label="Record Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></TextField>

              <MarkedToCustom
                element={md}
                open={null}
                setOpen={null}
                productId={productId}
                order="middle"
              ></MarkedToCustom>

              {/* <RecordView md={md} /> */}
            </FormControl>

            <Typography sx={{ fontSize: "12px", color: "red" }}>
              {error}
            </Typography>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          disabled={loading || !title}
        >
          Create record
        </Button>
      </DialogActions>
    </Dialog>
  );
}
