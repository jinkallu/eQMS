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
  TextField,
  InputAdornment,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { useExtnStore } from "../zustand/store";

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [options, setOptions] = React.useState([
    {
      type: "qm",
      label: "Quality Manual",
      isSelected: false,
    },

    { type: "sops", label: "SOPs", isSelected: false },
    {
      type: "products",
      label: "Products",
      isSelected: false,
    },
  ]);
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

  function handleQuatraceClick() {
    setOptions((prev) =>
      prev.map((opt) => {
        return { ...opt, isSelected: false };
      })
    );

    navigate("/qmshub.html/");
  }

  function handleClick(option) {
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.type === option.type) {
          return { ...opt, isSelected: true };
        } else {
          return { ...opt, isSelected: false };
        }
      })
    );

    navigate(`/qmshub.html/${option.type}`);
  }
  return (
    <Paper
      sx={{
        position: "fixed",
        top: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px",
        zIndex: 100,
        height: "50px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "32px",
        }}
      >
        <Box onClick={handleQuatraceClick}>
          <Typography color="primary" sx={{ cursor: "pointer" }}>
            Quatrace
          </Typography>
        </Box>
        <Box>
          <TextField
            id="searchInput"
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingRight: "12px",
        }}
      >
        {options?.map((option) => (
          <Chip
            key={option.label}
            label={option.label}
            sx={{ cursor: "pointer" }}
            color={option.isSelected ? "primary" : "default"}
            onClick={() => handleClick(option)}
          />
        ))}

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
        </Menu>
      </Box>
    </Paper>
  );
};

export default Header;
