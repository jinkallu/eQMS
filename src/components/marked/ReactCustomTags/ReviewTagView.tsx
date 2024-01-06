import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { useExtnStore } from "../../../zustand/store";
//import { fetchAuthorData } from "../../../utils/gitHelpers.js"
import useUpdateReviewTable from "../../../CHooks/buffer/useUpdateReviewTable";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ReviewTagView({ element, order, id }) {
  const { userSOPs, repository, project } = useExtnStore((state) => state);
  const [searchParams] = useSearchParams();
  const { authorData, fetchAuthorData } = useUpdateReviewTable();

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

    fetchAuthorData(project.id, repository.id, editBranchName);
  }, [project, repository, searchParams]);

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
        <input value={templateState[id]} onChange={handleChangeFun}></input>
      );

      break;
    case "middle":
      component = (
        // <input
        //   value={(templateState && templateState[id])}
        //   id={element.id}
        //   onChange={handleChangeFun}
        // ></input>

        <table id={id} style={{ border: "1px solid black" }}>
          <thead style={{ backgroundColor: "grey" }}>
            <tr>
              <th>Review Role</th>
              <th>Name</th>
              <th>Role</th>
              <th>Date</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Author</td>
              <td>{authorData?.name}</td>
              <td>25</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Reviewer</td>
              <td>5</td>
              <td>14</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Approver</td>
              <td>1</td>
              <td>4</td>
              <td>4</td>
            </tr>
          </tbody>
        </table>
      );
      break;
    case "last":
      if (templateState) {
        if (templateState[id]) {
          component = <span>{templateState[id]}</span>;
        } else {
          component = <span></span>;
        }
      } else {
        component = <span></span>;
      }

      //component = <input value={templateState[id]} onChange={handleChangeFun}></input>;

      break;
    default:
      component = <span>"Error";</span>;
      break;
  }
  return component;
}
