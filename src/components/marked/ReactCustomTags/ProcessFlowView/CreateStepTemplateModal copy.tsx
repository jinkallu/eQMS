import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  ListSubheader,
  MenuItem,
} from "@mui/material";

import { useExtnStore } from "../../../../zustand/store";

export default function CreateStepTemplateModal({
  open,
  setOpen,
  currentNode,
  state,
  handleChange,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  currentNode: any;
  state: any;
  handleChange: any;
}) {
  const { getFileContent, repository, project, userSOPs } = useExtnStore(
    (state) => state
  );
  const [template, setTemplate] = React.useState<string>();

  async function handleCreate() {
    addTemplate();
    setOpen(false);
  }

  function handleClose() {
    setOpen(false);
  }

  const addTemplate = () => {
    // const position = {
    //   x: currentNode.node.position.x + 200,
    //   y: currentNode.node.position.y,
    // };

    let templateName;

    userSOPs?.map((sop) => {
      const templateNameData = sop?.templates?.find(
        (item) => item.branchId === template
      )?.relativePath;
      if (templateNameData) {
        templateName = templateNameData;
      }
      return sop;
    });

    if (!templateName) {
      // show some error here
      return;
    }

    // const data = {
    //   label: templateName,
    //   type: "template",
    // };

    // const newNode = {
    //   ...currentNode.node,
    //   id: `${template}-template`,
    //   position,
    //   data,
    //   type: "template",
    // };

    const newNodes = state["processFlow"]?.nodes?.map((node) => {
      if (node.id === currentNode.node.id) {
        return {
          ...node,
          data: { ...node.data, templateName, templateId: template },
        };
      }
      return node;
    });
    handleChange("processFlow", {
      nodes: newNodes,
      edges: state["processFlow"]?.edges,
    });

    // const newEdge = {
    //   id: currentNode.node.id + "_" + newNode.id,
    //   source: currentNode.node.id,
    //   target: newNode.id,
    //   sourceHandle: "source_right",
    //   targetHandle: "target",
    // };

    // setEdges((edges) => {
    //   return [...edges, newEdge];
    // });

    //fitView();
  };

  function handleChangeData(e) {
    setTemplate(e.target.value);
  }

  async function getTemplateData() {
    let templateFull;

    userSOPs?.map((sop) => {
      const templateNameData = sop?.templates?.find(
        (item) => item.branchId === template
      );
      if (templateNameData) {
        templateFull = templateNameData;
      }

      return sop;
    });
    console.log(templateFull);

    if (templateFull) {
      const data = await getFileContent(
        repository.id,
        "qms/temp/data.html",
        templateFull.name
      );
      if (data) {
        const parser = new DOMParser();
        const html = parser.parseFromString(data, "text/html");
        const groupingData = html.getElementsByTagName("GROUPING");
        return groupingData;
      }

      return;
    }
  }

  async function createTemplateGroupingMatrix() {
    const groupingEls = await getTemplateData();
    if (!groupingEls) {
      return [];
    }
    const groupingMatrix = Array.from(groupingEls)?.map((item, index) => {
      const id = item.getAttribute("id");
      const name = item.getAttribute("name");
      return { id, name, order: index };
    });
  }

  useEffect(() => {
    if (
      open &&
      userSOPs?.length > 0 &&
      state &&
      state["processFlow"]?.nodes?.length >= 0
    ) {
      const nodes = state["processFlow"]?.nodes;
      const newUserSops = userSOPs?.map((sop) => {
        const templates = sop?.templates?.map((temp) => {
          const steps =
            nodes?.filter((node) => node?.data?.templateId === temp.branchId) ||
            [];
          return { ...temp, steps };
        });
        return { ...sop, templates };
      });
      console.log(newUserSops);
    }
  }, [userSOPs, state, open]);

  useEffect(() => {
    createTemplateGroupingMatrix();
  }, [template]);
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Template</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for the step...
        </DialogContentText>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel htmlFor="grouped-select">Select Template</InputLabel>
          <Select
            native
            defaultValue=""
            id="grouped-s"
            value={template}
            onChange={handleChangeData}
          >
            <option aria-label="None" value="" />
            {userSOPs
              ?.filter((item) => item.templates?.length > 0)
              ?.map((sop) => (
                <optgroup key={sop.relativePath} label={sop?.relativePath}>
                  {sop?.templates?.map((temp) => (
                    <option key={temp.branchId} value={temp.branchId}>
                      {temp?.relativePath}
                    </option>
                  ))}
                </optgroup>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={!template} onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
