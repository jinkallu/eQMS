import ArrowBack from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router";
export default function Product() {
  const navigate = useNavigate();

  return (
    <Box sx={{ alignSelf: "flex-start" }}>
      <ArrowBack onClick={() => navigate(-1)}></ArrowBack>
      <h1>Product</h1>;
    </Box>
  );
}
