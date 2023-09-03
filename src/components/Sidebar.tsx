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
import { useExtnStore } from "../zustand/store";
import { useNavigate } from "react-router";

export default function Sidebar() {
  const {
    project,
    setRepository,
    repository,
    setBranches,
    loadSOPs,
    branchTypes,
    sops,
  } = useExtnStore((state) => state);
  const navigate = useNavigate();
  const sideBarWidth = 340;

  React.useEffect(() => {
    if (project && project?.id) {
      setRepository(project?.id, project?.name);
    }
  }, [project]);

  React.useEffect(() => {
    if (repository && repository?.id) {
      // console.log(repository);
      // loadSOPs(repository?.id);
      // setBranches(repository?.id);
    }
  }, [repository]);

  React.useEffect(() => {
    // console.log(sops, branchTypes);
    // const sopsLength = sops?.length;
    // const newSOPs = branchTypes["sop"]?.map((sop, index) => {
    //   const sopData = sops?.find((item) => item.branchName === sop.name);
    //   if (sopData) {
    //     return { branchName: sop.name, sortOrder: sopData.sortOrder };
    //   } else {
    //     return { branchName: sop.name, sortOrder: sopsLength + index };
    //   }
    // });
    // console.log(newSOPs);
  }, [branchTypes]);
  return (
    <Paper
      elevation={3}
      sx={{
        padding: "12px",
        fontSize: 9,
        height: "100vh",
        width: { sideBarWidth },

        overflowY: "scroll",
      }}
    >
      <List
        sx={{
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
