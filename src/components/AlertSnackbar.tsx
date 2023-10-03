import { Alert, Snackbar } from "@mui/material";
import { useExtnStore } from "../zustand/store";

export default function AlertSnackbar() {
  const { openAlertSnackbar, message, severity, resetMessage } = useExtnStore(
    (state) => state
  );

  return (
    <Snackbar
      open={openAlertSnackbar}
      autoHideDuration={6000}
      onClose={resetMessage}
      message="Note archived"
    >
      <Alert onClose={resetMessage} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
