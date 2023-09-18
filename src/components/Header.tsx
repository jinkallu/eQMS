import {
  Paper,
  Chip,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useExtnStore } from "../zustand/store";

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const {
    isQualityMgrSelected,
    isQualityManager,

    setQualityMgrRole,
  } = useExtnStore();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleClick(page) {
    console.log("called");
    navigate(`/qmshub.html/${page}`);
  }
  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px",
      }}
    >
      <Box>
        <Typography color="primary" sx={{ cursor: "pointer" }}>
          Quatrace
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingRight: "12px",
        }}
      >
        <Chip
          label="Quality Manual"
          sx={{ cursor: "pointer" }}
          onClick={() => handleClick("qm")}
        />
        <Chip
          label="SOPs"
          sx={{ cursor: "pointer" }}
          onClick={() => handleClick("sops")}
        />
        <Chip
          label="Products"
          sx={{ cursor: "pointer" }}
          onClick={() => handleClick("products")}
        />

        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon></MoreVertIcon>
        </IconButton>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {isQualityManager && (
            <MenuItem onClick={handleClose}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isQualityMgrSelected}
                    onChange={(e) => setQualityMgrRole(e.target.checked)}
                  />
                }
                label="Qualtity Manager"
              />
            </MenuItem>
          )}
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Box>
    </Paper>
  );
};

export default Header;
