import Grid from "@mui/material/Grid";
import React, { useEffect } from "react";
import { useExtnStore } from "../../../zustand/store";
//import { fetchAuthorData } from "../../../utils/gitHelpers.js"
//import useUpdateReviewTable from "../../../CHooks/buffer/useUpdateReviewTable";
import useReviewer from "../../../CHooks/buffer/useReviewer";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useNavigate, useSearchParams } from "react-router-dom";

export default function VersionTagView({ element, order, id }) {
    const [versionIndex, setVersionIndex] = React.useState('');
    const { userSOPs, repository, project } = useExtnStore((state) => state);
    const [searchParams] = useSearchParams();
    //const { authorData, fetchAuthorData } = useUpdateReviewTable();
    const { versionData, getVersionData, versionHistory, getVersionHistory } = useReviewer();

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
        getVersionHistory(project.id, repository.id, branchName);
    }, [project, repository, searchParams]);

    const handleVersionChange = (event: SelectChangeEvent) => {
        const index_string = event.target.value as string;
        setVersionIndex(index_string);

        const index = parseInt(index_string);
        
        if(versionHistory){
            if(versionHistory.length <=0){
                return;
            }
        }
        else{
            return;
        }
        console.log("version commit id: ", versionHistory[index]?.commitId)
    };

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
                    <hr></hr>
                </>
            );

            break;
        case "middle":
            component = (
                <>
                    Version: <strong> {versionData + 1}_draft</strong>
                    <hr></hr>
                </>
            );
            break;
        case "last":
            component = (
                <>
                    <br></br> {/*TO be reomved*/}
                    Version: <strong>{versionData} </strong> Version in Edit: <strong>TODO</strong>
                    {/* <Box sx={{ minWidth: 12 }}> */}
                    <FormControl style={{ width: '200px', height: '50px' }}>
                        <InputLabel id="demo-simple-select-label">Previous Versions:</InputLabel>
                        <Select

                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={versionIndex}
                            label="Previous "
                            onChange={handleVersionChange}
                        >
                            {versionHistory?.map((version, index) => (
                                <MenuItem key={index} value={index}>
                                    {versionHistory.length - index}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* </Box> */}
                    <hr></hr>
                </>
            );
            break;
        default:
            component = <span>"Error";</span>;
            break;
    }
    return component;
}
