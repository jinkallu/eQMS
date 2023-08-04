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
  const sideBarWidth = 280;

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
    <Paper elevation={3} sx={{ padding: "12px", fontSize: 9 }}>
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
