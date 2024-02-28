import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useExtnStore } from "../../../../zustand/store";
//import { fetchAuthorData } from "../../../utils/gitHelpers.js"
import useUpdateReviewTable from "../../../../CHooks/buffer/useUpdateReviewTable";
import useReviewer from "../../../../CHooks/buffer/useReviewer";

import { useNavigate, useSearchParams } from "react-router-dom";
import { NodeViewWrapper } from "@tiptap/react";
import useFetchBranchFileContent from "../../../../CHooks/buffer/useFetchBranchFileContent";

export default function ImageTiptap({ order = "last", path }) {

  const { userSOPs, repository, project } = useExtnStore((state) => state);
  const [searchParams] = useSearchParams();

  const { fileContent, fetchBranchFile } = useFetchBranchFileContent();

  const { templateState, setTemplateState } = useExtnStore((state) => state);
  function handleChangeFun(e) {
    //setTemplateState(id, e.target.value);
  }

  useEffect(() => {
    if (!project?.id || !repository?.id || !searchParams) {
      return;
    }

    console.log(path);
    const filePath = "qms/sop/attachments/1.jpg";
    const branchName = searchParams.get("branchName");
    let lastIndex = branchName.lastIndexOf("/main");

    // Replace the last occurrence with "/edit"
    let editBranchName =
      branchName.substring(0, lastIndex) +
      "/edit" +
      branchName.substring(lastIndex + "/main".length);

    console.log(project?.id, repository?.id, filePath, editBranchName)
    fetchBranchFile(project?.id, repository?.id, filePath, editBranchName)
  }, [project, repository, searchParams])

  function arrayBufferToBase64(arrayBuffer) {
    const uint8Array = new Uint8Array(arrayBuffer);

    // Convert the Uint8Array to a Base64 encoded string
    let binary = '';
    uint8Array.forEach(byte => binary += String.fromCharCode(byte));
    return window.btoa(binary);
}
  let component;
  
  switch (order) {

    case "first":
      component = (
        <img src={`data:image/png;base64,${arrayBufferToBase64(fileContent)}`} alt="Lamp" width="100" height="100" />
      );

      break;
    case "middle":
      component = (
        <img src={`data:image/png;base64,${arrayBufferToBase64(fileContent)}`} alt="Lamp" width="100" height="100" />
      );
      break;
    case "last":
      component = (
        <img src={`data:image/png;base64,${arrayBufferToBase64(fileContent)}`} alt="Lamp" width="100" height="100" />
      );
      break;
    default:
      component = <span>"Error";</span>;
      break;
  }
  return <NodeViewWrapper>{component}</NodeViewWrapper>;
}
