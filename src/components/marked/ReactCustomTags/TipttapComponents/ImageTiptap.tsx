import { useEffect, useState } from "react";
import { useExtnStore } from "../../../../zustand/store";

import { useSearchParams } from "react-router-dom";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import useFetchBranchFileContent from "../../../../CHooks/buffer/useFetchBranchFileContent";
import { arrayBufferToBase64 } from "../../../../utils/conversionHelpers.js";
import { PropaneTankSharp } from "@mui/icons-material";

export default function ImageTiptap(props) {
  const { userSOPs, repository, project } = useExtnStore((state) => state);
  const [searchParams] = useSearchParams();

  const { fileContent, fetchBranchFile } = useFetchBranchFileContent();

  useEffect(() => {
    if (
      !project?.id ||
      !repository?.id ||
      !searchParams ||
      !props.node.attrs.path
    ) {
      return;
    }

    // const filePath = "qms/sop/attachments/1.jpg";
    const filePath = props.node.attrs.path;
    const branchName = searchParams.get("branchName");
    let lastIndex = branchName.lastIndexOf("/main");

    // Replace the last occurrence with "/edit"
    let editBranchName =
      branchName.substring(0, lastIndex) +
      "/edit" +
      branchName.substring(lastIndex + "/main".length);

    fetchBranchFile(project?.id, repository?.id, filePath, editBranchName);
  }, [project, repository, searchParams, PropaneTankSharp]);

  let component = (
    <NodeViewWrapper style={{ display: "inline" }}>
      <img
        src={`data:image/png;base64,${arrayBufferToBase64(fileContent)}`}
        alt="Lamp"
        width="100"
        height="100"
      />
    </NodeViewWrapper>
  );

  // let component;

  // switch (order) {
  //   case "first":
  //     component = (
  //       <img
  //         src={`data:image/png;base64,${arrayBufferToBase64(fileContent)}`}
  //         alt="Lamp"
  //         width="100"
  //         height="100"
  //       />
  //     );

  //     break;
  //   case "middle":
  //     component = (
  //       <img
  //         src={`data:image/png;base64,${arrayBufferToBase64(fileContent)}`}
  //         alt="Lamp"
  //         width="100"
  //         height="100"
  //       />
  //     );
  //     break;
  //   case "last":
  //     component = (
  //       <img
  //         src={`data:image/png;base64,${arrayBufferToBase64(fileContent)}`}
  //         alt="Lamp"
  //         width="100"
  //         height="100"
  //       />
  //     );
  //     break;
  //   default:
  //     component = <span>"Error";</span>;
  //     break;
  // }
  return <NodeViewWrapper>{component}</NodeViewWrapper>;
}
