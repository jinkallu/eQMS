import {
  Box,
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useGetRepoDetails } from "../zustand/store";
// import { useNavigate } from "react-router";
import React from "react";
import { markedToHtml } from "../utils/markedHelper";
import { createSearchParams, useNavigate } from "react-router-dom";

export default function SidebarListItem({ type, label }) {
  const {
    branchTypes,
    setFileNames,
    repository,
    branchFileNames,
    setFileContent,
  } = useGetRepoDetails((state) => state);
  const [open, setOpen] = React.useState(false);
  const [contentHtml, setContentHtml] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (repository && repository?.id) {
      branchTypes[type]?.map((branch) => {
        setFileNames(repository?.id, branch.name, type);
      });
    }
  }, [repository, branchTypes]);

  async function handleItemClick(branch) {
    await setFileContent(
      repository?.id,
      `/qms/${branch.type}/${branch.relativePath}/${branch.relativePath}.md`,
      branch.name,
      branch.objectId
    );

    navigate({
      pathname: "content/",
      search: `?${createSearchParams({
        objectId: branch.objectId,
      })}`,
    });
  }

  return (
    <>
      <ListItem
        id={type}
        disablePadding
        onClick={() => setOpen((prev) => !prev)}
      >
        <ListItemButton>
          <ListItemText
            primaryTypographyProps={{ fontSize: "14px" }}
            primary={
              <Typography
                sx={{
                  fontSize: "14px",
                  clear: "both",
                  display: "inline-block",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </Typography>
            }
          ></ListItemText>
        </ListItemButton>
        <Chip
          label={branchTypes && branchTypes[type]?.length}
          color="success"
          variant="outlined"
          size="small"
        ></Chip>
        <AddIcon onClick={() => navigate(`${type}crud`)}></AddIcon>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {branchFileNames
            ?.filter((branch) => branch.type === type)
            ?.map((branch) => {
              return (
                <ListItemButton
                  key={branch.objectId}
                  sx={{ pl: 4 }}
                  onClick={() => handleItemClick(branch)}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: "14px",
                          clear: "both",
                          display: "inline-block",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {branch.relativePath}
                      </Typography>
                    }
                  />
                </ListItemButton>
              );
            })}
        </List>
      </Collapse>
    </>
  );
}
