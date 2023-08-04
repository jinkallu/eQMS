import React from "react";
import {
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import SidebarListItem from "./SidebarListItem";
import { useProject, useGetRepoDetails } from "../zustand/store";
import { useNavigate } from "react-router";

export default function Sidebar() {
  const { project, setProject } = useProject((state) => state);
  const { setRepository, repository, setBranches } = useGetRepoDetails(
    (state) => state
  );
  const navigate = useNavigate();
<<<<<<< HEAD
  const sideBarWidth = 280;
=======
  const sideBarWidth = 260;
>>>>>>> aa2c5baa0be1a3699bc77f124b13e6e834c03fb5

  React.useEffect(() => {
    if (project && project?.id) {
      console.log(project);
      setRepository(project?.id, project?.name);
    }
  }, [project]);

  React.useEffect(() => {
    if (repository && repository?.id) {
      setBranches(repository?.id);
    }
  }, [repository]);
  return (
<<<<<<< HEAD
    <Paper elevation={3} sx={{ padding: "12px", fontSize: 9 }}>
=======
    <Paper elevation={3} sx={{ padding: "12px" }}>
>>>>>>> aa2c5baa0be1a3699bc77f124b13e6e834c03fb5
      <List
        sx={{
          maxWidth: { sideBarWidth },
          bgcolor: "background.paper",
        }}
        subheader={
          <ListSubheader component="div" id="subheader">
            QMS
          </ListSubheader>
        }
        component="nav"
      >
        <SidebarListItem type="qm" label="Quality Manual"></SidebarListItem>
        <SidebarListItem type="sop" label="SOPs"></SidebarListItem>
        <SidebarListItem type="temp" label="Templates"></SidebarListItem>
        <Divider></Divider>
        <SidebarListItem type="prod" label="Products"></SidebarListItem>
        <Divider></Divider>
        <ListItem onClick={() => navigate("marked/")}>
          <Typography>Marked.</Typography>
        </ListItem>
      </List>
    </Paper>
  );
}
