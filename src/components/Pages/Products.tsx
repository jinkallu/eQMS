import React from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  CircularProgress,
  Fab,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// import SOPCard from "../SOPCard";

import { useExtnStore } from "../../zustand/store";
import { createSearchParams, useNavigate } from "react-router-dom";
import ProdCRUD from "../ProdCRUD";
import ProductCard from "../ProductCard";

// import AddSOP from "../AddSOP";

const Products = () => {
  const {
    branchFileNames,
    userProducts,
    isQualityMgrSelected,
    repository,
    branchTypes,
    refreshProductDBData,
    refreshSOPDBData,
    project,
    userSOPs,
  } = useExtnStore((state) => state);

  // testing the product SOPs
  //

  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [openAddProductModal, setOpenAddProductModal] = React.useState(false);

  async function refreshData(projectId, projectName, repositoryId) {
    setLoading(true);
    try {
      await refreshProductDBData(projectId, projectName, repositoryId);
      await refreshSOPDBData(project.id, project.name, repository.id);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (project && project?.id && repository && repository.id) {
      refreshData(project.id, project.name, repository.id);
    }
  }, [project, repository]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <ProdCRUD
        open={openAddProductModal}
        setOpen={setOpenAddProductModal}
      ></ProdCRUD>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "12px",
          alignItems: "flex-end",
          gap: "5px",
          paddingBottom: "12px",
        }}
      >
        {isQualityMgrSelected && (
          <Tooltip title="Add Product">
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => setOpenAddProductModal(true)}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        )}
        <Box sx={{ flexGrow: 1 }}></Box>
      </Box>
      <Box sx={{ paddingX: "9px", paddingY: "32px" }}>
        <Typography variant="subtitle1">
          Here is a list products..Click any product to view the records
        </Typography>
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress></CircularProgress>
        </Box>
      ) : userProducts?.length > 0 ? (
        <Grid
          container
          spacing={{ xs: 2, md: 3, lg: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ padding: "9px" }}
        >
          {userProducts
            ?.sort((product) => product?.sortOrder)
            ?.map((product) => {
              const branch = branchFileNames?.find(
                (item) =>
                  item.branchId === product.branchId && item.type === "product"
              );

              //
              return (
                <Grid key={product.branchId} item xs={2} sm={2} md={2} lg={2}>
                  <ProductCard product={product}></ProductCard>
                </Grid>
              );
            })}
        </Grid>
      ) : (
        <Box
          sx={{
            paddingX: "9px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>
            No Products to display..Create one from Quality Manager role
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Products;
