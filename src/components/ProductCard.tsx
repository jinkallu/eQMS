import { Paper } from "@mui/material";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";

export default function ProductCard({ branch, product }) {
  const navigate = useNavigate();

  async function handleItemClick() {
    navigate({
      pathname: "/qmshub.html/product/",
      search: `?${createSearchParams({
        objectId: branch?.objectId,
        relativePath: branch?.relativePath,
        type: branch?.type,
        branchName: branch?.name,
      })}`,
    });
  }
  return (
    <Paper sx={{ cursor: "pointer", minHeight: 200 }} onClick={handleItemClick}>
      {product?.relativePath}
    </Paper>
  );
}
