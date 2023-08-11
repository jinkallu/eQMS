import { Alert, Snackbar } from "@mui/material";
import { useAlertSnackbar } from "../zustand/store";

export default function AlertSnackbar() {
  const { open, message, severity, resetMessage } = useAlertSnackbar(
    (state) => state
  );

  return (
    <Snackbar
      open={open}
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
