import { Chip, ListItem, ListItemButton, ListItemText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useGetRepoDetails } from "../zustand/store";
import { useNavigate } from "react-router";
import React from "react";

export default function SidebarListItem({ type, label }) {
  const { branchTypes, setFileContent, repository } = useGetRepoDetails(
    (state) => state
  );
  const navigate = useNavigate();

  React.useEffect(() => {
    if (repository && repository?.id) {
      if (type === "qm") {
        setFileContent(null, repository?.id, "qms/qm/Quality-Manual", null);
      }
    }
  }, [repository]);
  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemText primary={label}></ListItemText>
      </ListItemButton>
      <Chip
        label={branchTypes && branchTypes[type]?.length}
        color="success"
        variant="outlined"
      ></Chip>
      <AddIcon onClick={() => navigate(`${type}crud`)}></AddIcon>
    </ListItem>
  );
}
