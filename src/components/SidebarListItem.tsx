import {
  Box,
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowRight from "@mui/icons-material/ArrowRight";
import { useExtnStore } from "../zustand/store";
import React from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export default function SidebarListItem({ type, label }) {
  const { branchTypes, setFileNames, repository, branchFileNames, userSOPs } =
    useExtnStore((state) => state);
  const [open, setOpen] = React.useState(false);
  const [contentHtml, setContentHtml] = React.useState("");
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");

  React.useEffect(() => {
    if (repository && repository?.id) {
      branchTypes[type]?.map((branch) => {
        setFileNames(repository?.id, branch.branchId, branch.name, type);
      });
    }
  }, [repository, branchTypes]);

  async function handleItemClick(branch) {
    navigate({
      pathname: "content/",
      search: `?${createSearchParams({
        objectId: branch?.objectId,
        relativePath: branch?.relativePath,
        type: branch?.type,
        branchName: branch?.name,
      })}`,
    });
  }

  const GetListItems = ({ type, branchFileNames, userSOPs }) => {
    console.log("branchFileNames", branchFileNames, type, userSOPs);
    if (type === "sop")
      return branchFileNames
        ?.filter(
          (branch) =>
            branch.type === type &&
            userSOPs?.find((item) => item.branchId === branch.branchId)
        )
        ?.sort((a, b) => a.name.split("-")[1] - b.relativePath.split("-")[1])
        ?.map((branch) => {
          return (
            <ListItemButton
              key={branch.objectId}
              selected={branch.objectId === objectId}
              sx={{ pl: 4 }}
              onClick={() => handleItemClick(branch)}
            >
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      color: "0b204d",
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
              {branch.objectId === objectId && <ArrowRight></ArrowRight>}
            </ListItemButton>
          );
        });
    console.log(userSOPs);

    if (type === "temp") {
      return userSOPs?.map((sop) => (
        <>
          <ListItemButton color="primary">
            <ListItemText primary={sop.name} />
          </ListItemButton>
          {sop?.templates?.map((template) =>
            branchFileNames
              ?.filter(
                (branch) => branch.type === type && branch.branchId === template
              )
              ?.sort(
                (a, b) => a.name.split("-")[1] - b.relativePath.split("-")[1]
              )
              ?.map((branch) => (
                <ListItemButton
                  key={branch.objectId}
                  selected={branch.objectId === objectId}
                  sx={{ pl: 4 }}
                  onClick={() => handleItemClick(branch)}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          color: "0b204d",
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
                  {branch.objectId === objectId && <ArrowRight></ArrowRight>}
                </ListItemButton>
              ))
          )}
        </>
      ));
    }
  };

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
                  fontWeight: "600",
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
        <AddIcon
          sx={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`add${type}`);
          }}
        ></AddIcon>
        {/* {open ? <ExpandLess /> : <ExpandMore />} */}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <GetListItems
            type={type}
            branchFileNames={branchFileNames}
            userSOPs={userSOPs}
          ></GetListItems>
        </List>
      </Collapse>
    </>
  );
}
