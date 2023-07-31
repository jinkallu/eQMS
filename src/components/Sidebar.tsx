import React from "react";
import {
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import SidebarListItem from "./SidebarListItem";
import { useProject, useGetRepoDetails } from "../zustand/store";

export default function Sidebar() {
  const { project, setProject } = useProject((state) => state);
  const { setRepository, repository, setBranches } = useGetRepoDetails(
    (state) => state
  );
  const sideBarWidth = 240;

  React.useEffect(() => {
    if (project && project?.id) {
      setRepository(project?.id, project?.name);
    }
  }, [project]);

  React.useEffect(() => {
    if (repository && repository?.id) {
      setBranches(repository?.id);
    }
  }, [repository]);
  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: `${sideBarWidth}px`,
        alignItems: "stretch",
        padding: "5px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: "5px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>QMS</Typography>
      </Box>
      <Divider></Divider>
      <List>
        <SidebarListItem type="qm" label="Quality Manual"></SidebarListItem>
        <SidebarListItem type="sop" label="SOPs"></SidebarListItem>
        <SidebarListItem type="temp" label="Templates"></SidebarListItem>
      </List>
      <Divider></Divider>
      <List>
        <SidebarListItem type="prod" label="Products"></SidebarListItem>
      </List>
    </Paper>
  );
}
