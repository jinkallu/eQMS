import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { useExtnStore } from "../zustand/store";

import {
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Paper,
  Typography,
  CardHeader,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { createSearchParams, useNavigate } from "react-router-dom";

export default function SOPCard({ branch, sop }) {
  const { branchFileNames } = useExtnStore((state) => state);
  const navigate = useNavigate();

  async function handleItemClick(branch) {
    navigate({
      pathname: "/qmshub.html/content/",
      search: `?${createSearchParams({
        objectId: branch?.objectId,
        relativePath: branch?.relativePath,
        type: branch?.type,
        branchName: branch?.name,
      })}`,
    });
  }

  function handleAddTempClick(e, branch) {
    e.stopPropagation();
    navigate({
      pathname: "/qmshub.html/addtemp",
      search: `?${createSearchParams({
        branchId: branch.branchId,
        name: branch.relativePath,
      })}`,
    });
  }

  return (
    <Box>
      <Card
        variant="outlined"
        sx={{ "&:hover": { border: "2px solid #082567" } }}
      >
        <CardHeader
          sx={{ paddingBottom: "5px" }}
          avatar={
            <Avatar aria-label="recipe" sx={{ backgroundColor: "#082567" }}>
              <Typography sx={{ fontSize: "12px" }}>
                {branch.relativePath?.split("-")[1]}
              </Typography>
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title=<Typography
            sx={{ cursor: "pointer", fontSize: 14, fontWeight: 600 }}
            onClick={() => handleItemClick(branch)}
            color="primary"
          >
            {branch.relativePath}
          </Typography>
        />
        <CardContent>
          <Box
            sx={{
              height: 200,
              overflow: "auto",
              borderTop: "1px solid indigo",
              paddingTop: "5px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontSize: 14, fontWeight: 600, paddingLeft: "5px" }}
                color="success"
              >
                Templates
              </Typography>
              {sop?.author?.length > 0 && (
                <Tooltip title="Add Template">
                  <AddIcon
                    onClick={(e) => handleAddTempClick(e, branch)}
                  ></AddIcon>
                </Tooltip>
              )}
            </Box>
            <List
              dense={true}
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 300,
              }}
            >
              {sop?.templates?.length > 0 ? (
                sop?.templates?.map((template) => {
                  const tempBranch = branchFileNames.find(
                    (item) => item.type === "temp" && item.branchId === template
                  );

                  return (
                    <ListItem
                      key={tempBranch?.id}
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "grey" },
                      }}
                      onClick={() => handleItemClick(tempBranch)}
                    >
                      <ListItemText primary={tempBranch?.relativePath} />
                    </ListItem>
                  );
                })
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: 12 }}>
                    No templates available
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
