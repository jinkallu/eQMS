import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { useExtnStore } from "../../../../zustand/store";
//import { fetchAuthorData } from "../../../utils/gitHelpers.js"
import useUpdateReviewTable from "../../../../CHooks/buffer/useUpdateReviewTable";
import useReviewer from "../../../../CHooks/buffer/useReviewer";

import { useNavigate, useSearchParams } from "react-router-dom";
import { NodeViewWrapper } from "@tiptap/react";

export default function ReviewTagTiptap({ order = "last", id }) {
  const { userSOPs, repository, project } = useExtnStore((state) => state);
  const [searchParams] = useSearchParams();
  const { authorData, fetchAuthorData } = useUpdateReviewTable();
  const { reviewerData, getReviewerData } = useReviewer();

  const { templateState, setTemplateState } = useExtnStore((state) => state);
  function handleChangeFun(e) {
    setTemplateState(id, e.target.value);
  }

  useEffect(() => {
    if (!project?.id || !repository?.id || !searchParams) {
      return;
    }
    const branchName = searchParams.get("branchName");
    let lastIndex = branchName.lastIndexOf("/main");

    // Replace the last occurrence with "/edit"
    let editBranchName =
      branchName.substring(0, lastIndex) +
      "/edit" +
      branchName.substring(lastIndex + "/main".length);

    fetchAuthorData(project.id, repository.id, branchName);
    getReviewerData(project.id, repository.id, branchName);
  }, [project, repository, searchParams]);

  useEffect(() => {
    console.log(authorData);
  }, [authorData]);

  useEffect(() => {
    console.log(reviewerData);
  }, [reviewerData]);

  // useEffect(() => {
  //   const val = element.getAttribute("value");
  //   if (id && handleChange) handleChange(id, val || "");
  // }, [element, id, handleChange]);

  let component;
  // console.log(element);
  // const val = element.getAttribute("value");
  // if ((!state || !state[id]) && order !== "last") {
  //   return <span>Loading input</span>;
  // }
  switch (order) {
    case "first":
      //component = element.outerHTML;

      component = (
        <table id={id} style={{ border: "1px solid black" }}>
          <thead style={{ backgroundColor: "grey" }}>
            <tr>
              <th>Review Role</th>
              <th>Name</th>
              <th>Role</th>
              <th>Signature Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Author</td>
              <td>{authorData?.name}</td>
              <td></td>
              <td>{authorData?.date.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Reviewer</td>
              <td>{reviewerData?.createdBy?.displayName}</td>
              <td></td>
              <td>{reviewerData?.creationDate?.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Approver</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      );

      break;
    case "middle":
      component = (
        <table id={id} style={{ border: "1px solid black" }}>
          <thead style={{ backgroundColor: "grey" }}>
            <tr>
              <th>Review Role</th>
              <th>Name</th>
              <th>Role</th>
              <th>Signature Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Author</td>
              <td>{authorData?.name}</td>
              <td></td>
              <td>{authorData?.date.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Reviewer</td>
              <td>{reviewerData?.createdBy?.displayName}</td>
              <td></td>
              <td>{reviewerData?.creationDate?.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Approver</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      );
      break;
    case "last":
      component = (
        <table id={id} style={{ border: "1px solid black" }}>
          <thead style={{ backgroundColor: "grey" }}>
            <tr>
              <th>Review Role</th>
              <th>Name</th>
              <th>Role</th>
              <th>Signature Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Author</td>
              <td>{authorData?.name}</td>
              <td></td>
              <td>{authorData?.date.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Reviewer</td>
              <td>{reviewerData?.createdBy?.displayName}</td>
              <td></td>
              <td>{reviewerData?.creationDate?.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Approver</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      );
      break;
    default:
      component = <span>"Error";</span>;
      break;
  }
  return <NodeViewWrapper>{component}</NodeViewWrapper>;
}
