import { Chip, ListItem, ListItemButton, ListItemText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useGetRepoDetails } from "../zustand/store";

export default function SidebarListItem({ type, label }) {
  const branchTypes = useGetRepoDetails((state) => state.branchTypes);
  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemText primary={label}></ListItemText>
      </ListItemButton>
      <Chip
        label={branchTypes && branchTypes[type]?.length}
        color="success"
        variant="outlined"
      ></Chip>
      <AddIcon></AddIcon>
    </ListItem>
  );
}
