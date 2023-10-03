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
import StarBorder from "@mui/icons-material/StarBorder";
import { useExtnStore } from "../zustand/store";
import React from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export default function SidebarListItem({ type, label }) {
  const {
    branchTypes,
    setFileNames,
    repository,
    branchFileNames,
    userSOPs,
    isQualityMgrSelected,
  } = useExtnStore((state) => state);
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

      if (type === "sop") {
        const type = "temp";
        branchTypes[type]?.map((branch) => {
          setFileNames(repository?.id, branch.branchId, branch.name, type);
        });
      }
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

  const GetListItems = ({ type, branchFileNames, userSOPs }) => {
    if (type === "sop")
      return userSOPs
        ?.sort((sop) => sop?.sortOrder)
        ?.map((sop) => {
          const branch = branchFileNames?.find(
            (item) => item.branchId === sop.branchId && item.type === "sop"
          );
          return (
            <>
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
                {isQualityMgrSelected && (
                  <AddIcon
                    sx={{ cursor: "pointer" }}
                    onClick={(e) => handleAddTempClick(e, branch)}
                  ></AddIcon>
                )}
                {branch.objectId === objectId && <ArrowRight></ArrowRight>}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  sx={{ paddingLeft: "5px" }}
                >
                  {sop?.templates?.map((template) => {
                    const tempBranch = branchFileNames.find(
                      (item) =>
                        item.type === "temp" && item.branchId === template
                    );

                    return (
                      <ListItemButton
                        key={tempBranch.objectId}
                        selected={tempBranch.objectId === objectId}
                        sx={{ pl: 4 }}
                        onClick={() => handleItemClick(tempBranch)}
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
                              {tempBranch.relativePath}
                            </Typography>
                          }
                        />
                        {tempBranch.objectId === objectId && (
                          <ArrowRight></ArrowRight>
                        )}
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </>
          );
        });
    else {
      return <h1>Work to be done</h1>;
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
        {isQualityMgrSelected && (
          <AddIcon
            sx={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`add${type}`);
            }}
          ></AddIcon>
        )}
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
