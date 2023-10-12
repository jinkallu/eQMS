import { Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  console.log(product);

  async function handleItemClick() {
    navigate({
      pathname: "/qmshub.html/product/",
      search: `?${createSearchParams({
        relativePath: product?.relativePath,
        type: product?.type,
        branchName: product?.name,
        prodBranchId: product.branchId,
      })}`,
    });
  }
  return (
    <Paper
      sx={{
        cursor: "pointer",
        minHeight: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": { backgroundColor: "#e3dfde" },
        borderRadius: "5px",
      }}
      onClick={handleItemClick}
    >
      <Typography variant="h6">{product?.relativePath}</Typography>
    </Paper>
  );
}
