import { Paper } from "@mui/material";

export default function ProductCard({ branch, product }) {
  return <Paper sx={{ minHeight: 200 }}>{product?.relativePath}</Paper>;
}
