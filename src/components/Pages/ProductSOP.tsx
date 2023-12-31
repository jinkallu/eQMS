import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { v4 as uuidv4 } from "uuid";
import { useExtnStore } from "../../zustand/store";
import useCreateBranch from "../../CHooks/useCreateBranch";
import useCommit from "../../CHooks/useCommit";
import CreateRecordModal from "../CreateRecordModal";
import AddIcon from "@mui/icons-material/Add";
import RecordList from "../RecordList";
import { callbackify } from "util";
import RecordViewModal from "../RecordViewModal";
import useProcessSteps from "./useProcessSteps";

export default function ProductSOP({ process, prodBranchId }) {
  const [processFlowTree, setProcessFlowTree] = useState(null);
  const { project, repository, setBranches, setAlertMessage } = useExtnStore();
  const { createBranch, loading, branchCreated } = useCreateBranch();
  const { renameFile, loadingRenameFile, commit } = useCommit();
  const [openCreateRecordModal, setOpenCreateRecordModal] = useState(false);
  const [refreshReqd, setRefreshReqd] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState("");

  console.log(process);

  const [stepSelector, setStepSelector] = useState([]);

  const [parentId, setParentId] = useState("0");

  const { stepTree, createStepTree } = useProcessSteps();

  /*/ Below code to be removed after tests //

  const nodes = [
    {
      id: "Risk Management Plan",
    },
    {
      id: "Risk Analysis"
    },
    {
      id: "Risk Evaluation",
    },
    {
      id: "Risk Mitigation",
    }

  ];
  const edges = [
    {
      source: "Risk Management Plan",
      target: "Risk Analysis"
    },
    {
      source: "Risk Analysis",
      target: "Risk Evaluation"
    },
    {
      source: "Risk Analysis",
      target: "Risk Mitigation"
    }
  ]

  useEffect(() => {
    createStepTree(nodes, edges);
  }, [])
  // /*/

  useEffect(() => {
    setProcessFlowTree(stepTree);
  }, [stepTree]);

  // function iterateSteps(idx, processflowElm, stepsCreated) {
  //   if (!stepsCreated[idx].created) {
  //     const stepElm = stepsCreated[idx].step;
  //     const stepName = stepElm.getAttribute("name");
  //     const templateElms = stepElm.getElementsByTagName("template");
  //     let templateName = null;
  //     let templateId;
  //     if (templateElms.length > 0) {
  //       templateName = templateElms[0].getAttribute("name");
  //       templateId = templateElms[0].getAttribute("id");
  //     }
  //     const step = {
  //       name: stepName,
  //       stepElm: stepElm,
  //       templateName: templateName,
  //       templateId,
  //       children: [],
  //     };

  //     stepsCreated[idx].created = true;
  //     const connectElms = stepElm.getElementsByTagName("connect");
  //     if (connectElms.length > 1) {
  //       console.log("Error! More than one connectiosn from same step");
  //       //TODO: Manage this error
  //     } else if (connectElms.length >= 1) {
  //       const connectToAttribute = connectElms[0].getAttribute("to");
  //       if (connectToAttribute) {
  //         let conStepElements = [];
  //         for (let i = 0; i < stepsCreated.length; i++) {
  //           const name = stepsCreated[i].step.getAttribute("name");
  //           if (name === connectToAttribute) {
  //             conStepElements.push(i);
  //           }
  //         }
  //         for (let i = 0; i < conStepElements.length; i++) {
  //           const childStep = iterateSteps(
  //             conStepElements[i],
  //             processflowElm,
  //             stepsCreated
  //           );
  //           if (childStep) {
  //             step.children.push(childStep);
  //           }
  //         }
  //       }
  //     }

  //     return step;
  //   } else {
  //     return null;
  //   }
  // }

  // function parseProcessFlow(value) {
  //   const processflowElm = value.processflowElement as HTMLElement;
  //   const processFlow = {
  //     //name: element.getAttribute("name"),
  //     //order: parseInt(element.getAttribute("order")),
  //     sopId: value.sop.branchId, // TODO: Or just SOP?
  //     steps: [],
  //   };
  //   const steps = processflowElm.getElementsByTagName("step");

  //   const stepsCreated = [];
  //   for (let i = 0; i < steps.length; i++) {
  //     //steps.forEach((stepElement) => {
  //     const step = { step: steps[i], created: false };
  //     stepsCreated.push(step);
  //   }

  //   for (let i = 0; i < stepsCreated.length; i++) {
  //     const step = iterateSteps(i, processflowElm, stepsCreated);
  //     if (step) {
  //       processFlow.steps.push(step);
  //     }
  //   }
  //   setProcessFlowTree(processFlow);
  // }

  function createStepsTree(process) {
    try {
      const nodes = JSON.parse(process.processflowElement.dataset.nodes);
      const edges = JSON.parse(process.processflowElement.dataset.edges);

      createStepTree(nodes, edges, process.sop.branchId);
    } catch (e) {
      console.log("error", e);
    }
    //parseProcessFlow(process);
  }

  async function handleCreate(title, content) {
    // check for duplicate name or number

    const newTitle = title.replace(/ /g, "_");

    // create unique id for the sop branch name
    const uniqueId = uuidv4();
    const branchName = `qms/rec/${prodBranchId}/${process.sop.branchId}/${currentTemplateId}/${parentId}/${uniqueId}/${newTitle}/main`;
    const res = await createBranch(
      project.id,
      repository.id,
      "main",
      branchName
    );

    // create path for the sop like sop/management/
    let newPath = newTitle;
    // if (number) {
    //   newPath = number + "-" + newPath;
    //   newPath = "sop" + "-" + newPath;
    // }
    newPath = "qms/rec/data.html";

    // rename the current readme.md so that the folder structure created..

    const renameRes = await renameFile(
      project.id,
      repository.id,
      branchName,
      "/README.md",
      newPath,
      "rename default README.md file"
    );
    if (renameRes) {
      setBranches(repository.id);
    }

    setOpenCreateRecordModal(false);

    if (renameRes) {
      const res = await commit(
        project.id,
        repository.id,
        branchName,
        newPath,
        content,
        "Record initial creation"
      );
      setAlertMessage({ message: "Document Created...", severity: "success" });
      setRefreshReqd((prev) => !prev);
    } else {
      setAlertMessage({
        message: "Document Creation not successfull...",
        severity: "error",
      });
    }
  }

  function handleNewCreate() {
    setStepSelector(processFlowTree?.steps);
    // setStepSelector(stepTree?.steps);

    setOpenCreateRecordModal(true);
  }

  function setCurrentRecordforView(record) {}

  useEffect(() => {
    if (process && process?.sop) {
      createStepsTree(process);
    }
  }, [process]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      {open && (
        <CreateRecordModal
          open={openCreateRecordModal}
          setOpen={setOpenCreateRecordModal}
          stepName={processFlowTree?.steps[0]?.name}
          handleCreate={handleCreate}
          currentTemplateId={currentTemplateId}
          stepSelector={stepSelector}
          setCurrentTemplateId={setCurrentTemplateId}
          productId={prodBranchId}
        ></CreateRecordModal>
      )}

      {process && process?.sop && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <RecordList
            productId={prodBranchId}
            processFlowTree={processFlowTree}
            refreshReqd={refreshReqd}
            setOpenCreateRecordModal={setOpenCreateRecordModal}
            setParentId={setParentId}
            setCurrentTemplateId={setCurrentTemplateId}
            setStepSelector={setStepSelector}
            handleNewCreate={handleNewCreate}
            setCurrentRecordforView={setCurrentRecordforView}
          ></RecordList>
        </Box>
      )}
    </Box>
  );
}
