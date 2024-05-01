import {
  Alert,
  AppBar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PublishIcon from "@mui/icons-material/Publish";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { StudentData } from "../models/Models";
import { Timestamp } from "firebase/firestore";
import StudentDB from "../data/StudentDB";
import CloseIcon from "@mui/icons-material/Close";

function RegisterHeader() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#c43835" }}>
      <Box sx={{ display: "flex", alignItems: "center", margin: ".5rem" }}>
        <Tooltip title="Home">
          <IconButton
            size="large"
            color="inherit"
            onClick={() => (window.location.href = "/")}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h6">Register</Typography>
      </Box>
    </AppBar>
  );
}

function OnSubmitUpload(
  event: React.FormEvent<HTMLFormElement>,
  studentData: StudentData,
  setInputErrorIndicator: React.Dispatch<
    React.SetStateAction<InputErrorIndicator>
  >,
  inputErrorIndicator: InputErrorIndicator,
  handleOpenAlert: (severity: string, message: string) => void
) {
  event.preventDefault();
  let errorIndicator = {
    ...inputErrorIndicator,
  };

  setInputErrorIndicator({
    StudentName: "",
    Section: "",
    GradeLevel: "",
    Strand: "",
    RFIDCode: "",
  });

  const isValidRFID = (): boolean => {
    const isHex = /^[0-9A-Fa-f]+$/g.test(studentData.RFIDCode);
    if (
      !isHex ||
      studentData.RFIDCode.length > 8 ||
      studentData.RFIDCode.length < 8
    ) {
      return false;
    }
    return true;
  };

  if (studentData.StudentName.length === 0) {
    errorIndicator.StudentName = "Student name cannot be empty";
    setInputErrorIndicator(errorIndicator);
  } else if (studentData.GradeLevel === 0) {
    errorIndicator.GradeLevel = "Grade level cannot be empty";
    setInputErrorIndicator(errorIndicator);
  } else if (studentData.Strand === "") {
    errorIndicator.Strand = "Strand cannot be empty";
    setInputErrorIndicator(errorIndicator);
  } else if (studentData.Section === "") {
    errorIndicator.Section = "Section cannot be empty";
    setInputErrorIndicator(errorIndicator);
  } else if (!isValidRFID()) {
    errorIndicator.RFIDCode = "Invalid RFID code";
    setInputErrorIndicator(errorIndicator);
  } else {
    // Input validated, send data to server
    console.log(`Register.OnSubmitUpload: Submiting student data`);
    const data = {
      ...studentData,
    };
    data.AccountCreatedAt = Timestamp.fromDate(new Date()).toDate();

    const OnFinishedUploading = (isSuccess: boolean, message: string) => {
      if (!isSuccess && message === "RFID has already been taken") {
        handleOpenAlert("warning", message);
        errorIndicator.RFIDCode = "RFID has already been taken";
        setInputErrorIndicator(errorIndicator);
      } else if (!isSuccess) {
        handleOpenAlert("error", message);
      } else if (isSuccess) {
        handleOpenAlert("success", message);
      }
    };

    StudentDB.UploadStudent(studentData, OnFinishedUploading);
  }
}

interface InputErrorIndicator {
  StudentName: string;
  Section: string;
  GradeLevel: string;
  Strand: string;
  RFIDCode: string;
}

interface RegisterMainProps {
  HandleOpenAlert: (severity: string, message: string) => void;
}

function RegisterMain(props: RegisterMainProps) {
  const [inputErrorIndicator, setInputErrorIndicator] =
    useState<InputErrorIndicator>({
      StudentName: "",
      Section: "",
      GradeLevel: "",
      Strand: "",
      RFIDCode: "",
    });

  const [studentData, setStudentData] = useState<StudentData>({
    StudentName: "",
    Section: "",
    GradeLevel: 11,
    Strand: "STEM",
    RFIDCode: "",
    AccountCreatedAt: Timestamp.fromDate(new Date()).toDate(),
  });

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  return (
    <form
      className="m-0 p-0 w-full flex flex-col items-center"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        OnSubmitUpload(
          event,
          studentData,
          setInputErrorIndicator,
          inputErrorIndicator,
          props.HandleOpenAlert
        );
      }}
    >
      <div className="w-[50%] mt-12">
        <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
          Register New Student
        </Typography>
        <TextField
          helperText={inputErrorIndicator.StudentName}
          variant="outlined"
          name="StudentName"
          label="Student Name"
          sx={{ width: "100%", marginBottom: "1rem" }}
          onChange={onChangeInput}
        />
        <TextField
          helperText={inputErrorIndicator.Section}
          label="Section"
          name="Section"
          variant="outlined"
          sx={{ width: "100%", marginBottom: "1rem" }}
          onChange={onChangeInput}
        />
        <Box sx={{ marginBottom: "1rem", display: "flex" }}>
          <TextField
            helperText={inputErrorIndicator.GradeLevel}
            variant="outlined"
            select
            label="Grave Level"
            name="GradeLevel"
            value={studentData.GradeLevel}
            onChange={onChangeInput}
            sx={{ width: "100%", marginRight: ".5rem" }}
          >
            <MenuItem key={1} value={11}>
              11
            </MenuItem>
            <MenuItem key={2} value={12}>
              12
            </MenuItem>
          </TextField>
          <TextField
            helperText={inputErrorIndicator.Strand}
            variant="outlined"
            select
            label="Strand"
            name="Strand"
            value={studentData.Strand}
            onChange={onChangeInput}
            sx={{ width: "100%", marginLeft: ".5rem" }}
          >
            <MenuItem key={1} value="STEM">
              STEM
            </MenuItem>
            <MenuItem key={2} value="ABM">
              ABM
            </MenuItem>
            <MenuItem key={3} value="HUMSS">
              HUMSS
            </MenuItem>
            <MenuItem key={4} value="TVL">
              TVL
            </MenuItem>
          </TextField>
        </Box>
        <TextField
          helperText={inputErrorIndicator.RFIDCode}
          label="RFID Code"
          name="RFIDCode"
          variant="outlined"
          sx={{ width: "100%", marginBottom: "1rem" }}
          onChange={onChangeInput}
        />
        <Button
          size="large"
          variant="contained"
          startIcon={<PublishIcon />}
          sx={{ width: "100%" }}
          type="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

interface AlertAttribute {
  IsOpen: boolean;
  Severity: string;
  Message: string;
}
export function Register() {
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

  return (
    <>
      <RegisterHeader />
      <RegisterMain HandleOpenAlert={handleOpenAlert} />
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
    </>
  );
}
