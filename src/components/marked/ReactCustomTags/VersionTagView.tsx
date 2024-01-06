import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { useExtnStore } from "../../../zustand/store";
//import { fetchAuthorData } from "../../../utils/gitHelpers.js"
//import useUpdateReviewTable from "../../../CHooks/buffer/useUpdateReviewTable";
import useReviewer from "../../../CHooks/buffer/useReviewer";

import { useNavigate, useSearchParams } from "react-router-dom";

export default function VersionTagView({ element, order, id }) {
  const { userSOPs, repository, project } = useExtnStore((state) => state);
  const [searchParams] = useSearchParams();
  //const { authorData, fetchAuthorData } = useUpdateReviewTable();
  const { versionData, getVersionData } = useReviewer();

  const { templateState, setTemplateState } = useExtnStore((state) => state);
  function handleChangeFun(e) {
    setTemplateState(id, e.target.value);
  }

  useEffect(() => {
    if (!project?.id || !repository?.id || !searchParams) {
      return;
    }
    const branchName = searchParams.get("branchName");
    //let lastIndex = branchName.lastIndexOf("/main");

    // Replace the last occurrence with "/edit"
    // let editBranchName =
    //   branchName.substring(0, lastIndex) +
    //   "/edit" +
    //   branchName.substring(lastIndex + "/main".length);

    // fetchAuthorData(project.id, repository.id, editBranchName);
    getVersionData(project.id, repository.id, branchName);
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
        <>
         Version: <strong>{versionData + 1}_draft  </strong>
        </>
      );

      break;
    case "middle":
      component = (
        <>
        Version: <strong> {versionData + 1}_draft</strong>
        </>
      );
      break;
    case "last":
        component = (
            <>
            <br></br> {/*TO be reomved*/}
            Version: <strong>{versionData} </strong> Version in Edit: <strong>TODO</strong> Previous Versions: DROPDOWN
            </>
          );
      break;
    default:
      component = <span>"Error";</span>;
      break;
  }
  return component;
}
