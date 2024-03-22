import React from "react";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router";
import useProductSOPs from "../productSOPs/useProductSOPs";
import { useExtnStore } from "../../zustand/store";

import ProductSOP from "./ProductSOP";
import { useSearchParams } from "react-router-dom";

export default function Product() {
  const navigate = useNavigate();
  // const [tabValue, setTabValue] = React.useState(null);
  const [currentProcess, setCurrentProcess] = React.useState<any>({});
  const { processflows, sopsWithOrder, loadFileContent } = useProductSOPs();
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get("objectId");
  const relativePath = searchParams.get("relativePath");
  const branchName = searchParams.get("branchName");
  const prodBranchId = searchParams.get("prodBranchId");

  const { userSOPs, userProducts } = useExtnStore((state) => state);

  async function getSOPWithContents(userSOPs) {
    const data = await loadFileContent(userSOPs);
    sopsWithOrder(data);
  }
  React.useEffect(() => {
    if (userSOPs?.length > 0) {
      const product = userProducts?.find(
        (item) => item.branchId === prodBranchId
      );
      if (product) {
        const productSOPs = userSOPs?.filter((item) =>
          product?.sops?.includes(item.branchId)
        );
        if (productSOPs) {
          getSOPWithContents(productSOPs);
        }
      }
    }
  }, [userSOPs]);

  React.useEffect(() => {
    console.log(processflows);
    const defaultProcess = processflows?.filter((item) => item.order >= 0)[0];
    if (defaultProcess) {
      setCurrentProcess(defaultProcess);
    }
  }, [processflows]);

  function handleSOPClick(process) {
    setCurrentProcess(process);
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "32px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {processflows
            ?.filter((item) => item.order >= 0)
            ?.map((process) => (
              <Box
                sx={{
                  fontSize: "14px",
                  color: "#000000E6",
                  padding: "9px",
                  cursor: "pointer",
                  borderBottom:
                    currentProcess?.sop?.branchId === process?.sop?.branchId
                      ? "2px solid blue"
                      : "",
                }}
                onClick={() => handleSOPClick(process)}
                key={process?.sop?.branchId}
              >
                {process?.sop?.relativePath}
              </Box>
            ))}
        </Box>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack></ArrowBack>
        </IconButton>
      </Box>
      <Box sx={{ marginTop: "9px" }}>
        {currentProcess ? (
          <ProductSOP
            prodBranchId={prodBranchId}
            process={currentProcess}
          ></ProductSOP>
        ) : (
          <h3>Select any SOP</h3>
        )}
      </Box>
    </Box>
  );
}
