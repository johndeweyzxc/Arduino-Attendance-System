import { Alert, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

interface AlertAttribute {
  IsOpen: boolean;
  Severity: string;
  Message: string;
}
export default function Notification() {
  const [alertAttr, setAlertAttr] = useState<AlertAttribute>({
    IsOpen: false,
    Severity: "error",
    Message: "An error has been occurred",
  });

  const handleOpenAlert = (severity: string, message: string) => {
    setAlertAttr({
      IsOpen: true,
      Severity: severity,
      Message: message,
    });
  };
  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertAttr({
      ...alertAttr,
      IsOpen: false,
    });
  };

  let alertComponent: JSX.Element = <div></div>;

  if (alertAttr.Severity === "warning") {
    alertComponent = (
      <Alert
        onClose={handleCloseAlert}
        severity="warning"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {alertAttr.Message}
      </Alert>
    );
  } else if (alertAttr.Severity === "error") {
    alertComponent = (
      <Alert
        onClose={handleCloseAlert}
        severity="error"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {alertAttr.Message}
      </Alert>
    );
  } else if (alertAttr.Severity === "success") {
    alertComponent = (
      <Alert
        onClose={handleCloseAlert}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {alertAttr.Message}
      </Alert>
    );
  }

  return {
    SnackBar: (
      <Snackbar
        open={alertAttr.IsOpen}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        action={
          <React.Fragment>
            <IconButton
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleCloseAlert}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      >
        {alertComponent}
      </Snackbar>
    ),
    HandleOpenAlert: handleOpenAlert,
  };
}
